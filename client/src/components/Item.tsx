import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons'
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Dispatch, useContext, useState } from 'react'

import { createAuthApiRequest } from '../helpers/createApiRequest'
import { ICategoryItem } from '../interfaces/ICategoryItem'
import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages'
import {
  setError,
  toggleEditMode,
  toggleSending,
  updateItems
} from '../store/actions'
import { ConfirmDelete } from './ConfirmDelete'

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

    const moveUpRequest = createAuthApiRequest({
      body: { category: activeCategory, name: item.name },
      endpoint: 'menu/item/moveItemUp',
      method: 'PUT'
    })

    try {
      const rawResponse = await moveUpRequest
      const response = await rawResponse.json()

      if (response.message === 'Token expired') {
        tokenExpired()
        return
      }

      if (!rawResponse.ok) {
        dispatch(
          setError(
            response.message || "oops! that didn't work, please try again"
          )
        )
        return
      }

      dispatch(updateItems(activeCategory, response))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(toggleSending())
    }
  }

  const moveDown = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    const moveDownRequest = createAuthApiRequest({
      body: { category: activeCategory, name: item.name },
      endpoint: 'menu/item/moveItemDown',
      method: 'PUT'
    })

    try {
      const rawResponse = await moveDownRequest
      const response = await rawResponse.json()

      if (response.message === 'Token expired') {
        tokenExpired()
        return
      }

      if (!rawResponse.ok) {
        dispatch(
          setError(
            response.message || "oops! that didn't work, please try again"
          )
        )
        return
      }

      dispatch(updateItems(activeCategory, response))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(toggleSending())
    }
  }

  const deleteItem = async () => {
    setConfirmDelete(false)
    dispatch(toggleSending())
    dispatch(setError(''))

    const deleteItemRequest = await createAuthApiRequest({
      body: { category: activeCategory, name: item.name },
      endpoint: 'menu/item',
      method: 'DELETE'
    })

    try {
      const rawResponse = await deleteItemRequest
      const response = await rawResponse.json()
      if (response.message === 'Token expired') {
        tokenExpired()
        return
      }

      if (!rawResponse.ok) {
        dispatch(
          setError(
            response.message || "oops! that didn't work, please try again"
          )
        )
        return
      }

      dispatch(updateItems(activeCategory, response))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(toggleSending())
    }
  }

  return (
    <HStack p={'10px'} spacing={'10px'}>
      <VStack visibility={editMode ? 'visible' : 'hidden'} spacing={'3px'}>
        <ArrowUpIcon
          onClick={() => editMode && moveUp()}
          visibility={editMode && !isFirst ? 'visible' : 'hidden'}
        />
        <DeleteIcon onClick={() => editMode && setConfirmDelete(true)} />
        <ArrowDownIcon
          onClick={() => editMode && moveDown()}
          visibility={editMode && !isLast ? 'visible' : 'hidden'}
        />
      </VStack>

      <Box key={item.name}>
        <Heading size={'lg'}>{item.name}</Heading>
        <Text>
          {item.description} / <Text as={'span'}>{item.price}</Text>
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
