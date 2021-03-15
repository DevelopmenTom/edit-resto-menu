import { ArrowBackIcon, ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons'
import { Button, HStack, VStack } from '@chakra-ui/react'
import { Dispatch, useContext, useState } from 'react'

import { createAuthApiRequest } from '../../helpers/createApiRequest'
import { IMenuState } from '../../interfaces/IMenuState'
import { IReducerAction } from '../../interfaces/IReducerAction'
import { MenuContext } from '../../pages'
import {
  setActiveCategory,
  setError,
  toggleEditMode,
  toggleSending,
  updateCategories
} from '../../store/actions'
import { ConfirmDelete } from '../ConfirmDelete'

export type Props = {
  categoryName: string
  isFirst: boolean
  isLast: boolean
}

export const Category = ({ categoryName, isFirst, isLast }: Props) => {
  const { dispatch, state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  const [confirmDelete, setConfirmDelete] = useState(false)

  const { editMode } = state

  const tokenExpired = () => {
    dispatch(setError('Session Expired, please login again'))
    dispatch(toggleEditMode())
    localStorage.removeItem('token')
  }

  const moveBack = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    try {
      const categoryUpdate = await createAuthApiRequest<string[]>({
        body: { categoryToMove: categoryName },
        endpoint: 'menu/category/moveCategoryBack',
        method: 'PUT'
      })

      dispatch(updateCategories(categoryUpdate))
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

  const moveForward = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    try {
      const categoryUpdate = await createAuthApiRequest<string[]>({
        body: { categoryToMove: categoryName },
        endpoint: 'menu/category/moveCategoryForward',
        method: 'PUT'
      })

      dispatch(updateCategories(categoryUpdate))
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

  const deleteCategory = async () => {
    setConfirmDelete(false)
    dispatch(toggleSending())
    dispatch(setError(''))

    try {
      const categoryUpdate = await createAuthApiRequest<string[]>({
        body: { categoryToRemove: categoryName },
        endpoint: 'menu/category',
        method: 'DELETE'
      })

      dispatch(updateCategories(categoryUpdate))
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
    <VStack spacing={'5px'} pr={isLast ? '10px' : '0'}>
      {editMode && (
        <HStack pt={'10px'} spacing={'3px'}>
          <ArrowBackIcon
            cursor={'pointer'}
            onClick={() => editMode && moveBack()}
            visibility={!isFirst ? 'visible' : 'hidden'}
          />
          <DeleteIcon
            cursor={'pointer'}
            onClick={() => editMode && setConfirmDelete(true)}
          />
          <ArrowForwardIcon
            cursor={'pointer'}
            onClick={() => editMode && moveForward()}
            visibility={!isLast ? 'visible' : 'hidden'}
          />
        </HStack>
      )}

      <Button
        onClick={() => dispatch(setActiveCategory(categoryName))}
        variant={state.activeCategory === categoryName ? 'solid' : 'ghost'}
      >
        {categoryName}
      </Button>
      {confirmDelete && (
        <ConfirmDelete
          message={`Delete "${categoryName}" and all its items?`}
          onClose={() => setConfirmDelete(false)}
          onDelete={() => deleteCategory()}
        />
      )}
    </VStack>
  )
}
