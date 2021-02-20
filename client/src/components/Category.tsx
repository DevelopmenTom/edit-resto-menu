import { ArrowBackIcon, ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons'
import { Button, HStack, VStack } from '@chakra-ui/react'
import { Dispatch, useContext, useState } from 'react'

import { createAuthApiRequest } from '../helpers/createApiRequest'
import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages'
import {
  setActiveCategory,
  setError,
  toggleEditMode,
  toggleSending,
  updateCategories
} from '../store/actions'
import { ConfirmDelete } from './ConfirmDelete'

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

    const moveBackRequest = createAuthApiRequest({
      body: { categoryToMove: categoryName },
      endpoint: 'menu/category/moveCategoryBack',
      method: 'PUT'
    })

    try {
      const rawResponse = await moveBackRequest
      const response = await rawResponse.json()
      if (response.message === 'Token expired') {
        tokenExpired()
        return
      }

      if (!rawResponse.ok) {
        dispatch(setError("oops! that didn't work, please try again"))
        return
      }

      dispatch(updateCategories(response))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(toggleSending())
    }
  }

  const moveForward = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    const moveForwardRequest = createAuthApiRequest({
      body: { categoryToMove: categoryName },
      endpoint: 'menu/category/moveCategoryForward',
      method: 'PUT'
    })

    try {
      const rawResponse = await moveForwardRequest
      const response = await rawResponse.json()
      if (response.message === 'Token expired') {
        tokenExpired()
        return
      }

      if (!rawResponse.ok) {
        dispatch(setError("oops! that didn't work, please try again"))
        return
      }

      dispatch(updateCategories(response))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(toggleSending())
    }
  }

  const deleteCategory = async () => {
    setConfirmDelete(false)
    dispatch(toggleSending())
    dispatch(setError(''))

    const deleteCategoryRequest = await createAuthApiRequest({
      body: { categoryToRemove: categoryName },
      endpoint: 'menu/category',
      method: 'DELETE'
    })

    try {
      const rawResponse = await deleteCategoryRequest
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

      dispatch(updateCategories(response))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(toggleSending())
    }
  }

  return (
    <VStack spacing={'5px'}>
      <HStack visibility={editMode ? 'visible' : 'hidden'} spacing={'2px'}>
        <ArrowBackIcon
          onClick={() => editMode && moveBack()}
          visibility={editMode && !isFirst ? 'visible' : 'hidden'}
        />
        <DeleteIcon onClick={() => editMode && setConfirmDelete(true)} />
        <ArrowForwardIcon
          onClick={() => editMode && moveForward()}
          visibility={editMode && !isLast ? 'visible' : 'hidden'}
        />
      </HStack>
      <Button
        onClick={() => dispatch(setActiveCategory(categoryName))}
        variant={state.activeCategory === categoryName ? 'solid' : 'outline'}
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
