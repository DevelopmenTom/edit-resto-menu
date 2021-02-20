import { ArrowBackIcon, ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons'
import { Button, HStack, VStack } from '@chakra-ui/react'
import { Dispatch, useContext } from 'react'

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

export type Props = {
  categoryName: string
  isFirst: boolean
  isLast: boolean
}

export const CategoryItem = ({ categoryName, isFirst, isLast }: Props) => {
  const { dispatch, state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  const { editMode } = state

  const tokenExpired = () => {
    dispatch(setError('Session Expired, please login again'))
    dispatch(toggleEditMode())
    localStorage.removeItem('token')
  }

  const moveBack = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    const moveBackRequest = await createAuthApiRequest({
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

    const moveForwardRequest = await createAuthApiRequest({
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

  return (
    <VStack spacing={'5px'}>
      <HStack visibility={editMode ? 'visible' : 'hidden'} spacing={'2px'}>
        <ArrowBackIcon
          onClick={() => editMode && moveBack()}
          visibility={editMode && !isFirst ? 'visible' : 'hidden'}
        />
        <DeleteIcon />
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
    </VStack>
  )
}
