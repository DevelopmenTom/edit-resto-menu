import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons'
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Dispatch, useContext, useState } from 'react'

import { createAuthApiRequest } from '../../helpers/createApiRequest'
import { ICategoryItem } from '../../interfaces/ICategoryItem'
import { IMenuState } from '../../interfaces/IMenuState'
import { IReducerAction } from '../../interfaces/IReducerAction'
import { MenuContext } from '../../pages'
import {
  setError,
  toggleEditMode,
  toggleSending,
  updateItems
} from '../../store/actions'
import { ConfirmDelete } from '../ConfirmDelete'

export type Props = {
  item: ICategoryItem
  isFirst: boolean
  isLast: boolean
}

export const Item = ({ item, isFirst, isLast }: Props) => {
  const { dispatch, state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  const [confirmDelete, setConfirmDelete] = useState(false)

  const { activeCategory, editMode } = state

  const tokenExpired = () => {
    dispatch(setError('Session Expired, please login again'))
    dispatch(toggleEditMode())
    localStorage.removeItem('token')
  }

  const moveUp = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    try {
      const itemsUpdate = await createAuthApiRequest<ICategoryItem[]>({
        body: { category: activeCategory, name: item.name },
        endpoint: 'menu/item/moveItemUp',
        method: 'PUT'
      })

      dispatch(updateItems(activeCategory, itemsUpdate))
    } catch (err) {
      if (err.message === 'Token expired') {
        tokenExpired()
        return
      }
      dispatch(
        setError(err.message || "oops! that didn't work, please try again")
      )
    } finally {
      dispatch(toggleSending())
    }
  }

  const moveDown = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    try {
      const itemsUpdate = await createAuthApiRequest<ICategoryItem[]>({
        body: { category: activeCategory, name: item.name },
        endpoint: 'menu/item/moveItemDown',
        method: 'PUT'
      })

      dispatch(updateItems(activeCategory, itemsUpdate))
    } catch (err) {
      if (err.message === 'Token expired') {
        tokenExpired()
        return
      }
      dispatch(
        setError(err.message || "oops! that didn't work, please try again")
      )
    } finally {
      dispatch(toggleSending())
    }
  }

  const deleteItem = async () => {
    setConfirmDelete(false)
    dispatch(toggleSending())
    dispatch(setError(''))

    try {
      const itemsUpdate = await createAuthApiRequest<ICategoryItem[]>({
        body: { category: activeCategory, name: item.name },
        endpoint: 'menu/item',
        method: 'DELETE'
      })

      dispatch(updateItems(activeCategory, itemsUpdate))
    } catch (err) {
      if (err.message === 'Token expired') {
        tokenExpired()
        return
      }
      dispatch(
        setError(err.message || "oops! that didn't work, please try again")
      )
    } finally {
      dispatch(toggleSending())
    }
  }

  return (
    <HStack p={'10px'} spacing={'10px'}>
      <VStack visibility={editMode ? 'visible' : 'hidden'} spacing={'3px'}>
        <ArrowUpIcon
          cursor={'pointer'}
          onClick={() => editMode && moveUp()}
          visibility={editMode && !isFirst ? 'visible' : 'hidden'}
        />
        <DeleteIcon
          cursor={'pointer'}
          onClick={() => editMode && setConfirmDelete(true)}
        />
        <ArrowDownIcon
          cursor={'pointer'}
          onClick={() => editMode && moveDown()}
          visibility={editMode && !isLast ? 'visible' : 'hidden'}
        />
      </VStack>

      <Box key={item.name} w={['80vw', null, '60vw']}>
        <Heading size={'lg'}>{item.name}</Heading>
        <Text>
          {item.description} | <Text as={'i'}>{item.price}</Text>
        </Text>
      </Box>
      {confirmDelete && (
        <ConfirmDelete
          message={`Delete "${item.name}"?`}
          onClose={() => setConfirmDelete(false)}
          onDelete={() => deleteItem()}
        />
      )}
    </HStack>
  )
}
