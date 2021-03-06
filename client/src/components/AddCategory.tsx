import { TriangleDownIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  VStack
} from '@chakra-ui/react'
import { Dispatch, FormEvent, KeyboardEvent, useContext, useState } from 'react'

import { createAuthApiRequest } from '../helpers/createApiRequest'
import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages'
import {
  setError,
  toggleEditMode,
  toggleSending,
  updateCategories
} from '../store/actions'

export const AddCategory = () => {
  const { dispatch } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  const [showDialogue, setShowDialogue] = useState(false)
  const [inputValue, setInputValue] = useState<string>('')

  const tokenExpired = () => {
    dispatch(setError('Session Expired, please login again'))
    dispatch(toggleEditMode())
    localStorage.removeItem('token')
  }

  const closeDialogue = () => {
    setShowDialogue(false)
    setInputValue('')
  }

  const createCategory = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    try {
      const categoryUpdate = await createAuthApiRequest<string[]>({
        body: { newCategoryName: inputValue },
        endpoint: 'menu/category',
        method: 'POST'
      })

      dispatch(updateCategories(categoryUpdate))
      closeDialogue()
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

  const onKeyPress = (event: KeyboardEvent) => {
    dispatch(setError(''))
    if (event.key === 'Enter') {
      createCategory()
    }
  }

  const onChange = (event: FormEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value)
  }

  return (
    <>
      <VStack pt={'10px'} spacing={'5px'} pr={'10px'}>
        <TriangleDownIcon />
        <Button
          colorScheme="green"
          onClick={() => setShowDialogue(true)}
          variant={'ghost'}
        >
          Create
        </Button>
      </VStack>
      {showDialogue && (
        <AlertDialog
          isOpen={true}
          leastDestructiveRef={undefined}
          onClose={() => closeDialogue()}
        >
          <AlertDialogOverlay>
            <AlertDialogContent m={'10px'}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Choose a non-existing name
              </AlertDialogHeader>

              <AlertDialogBody>
                <Input
                  onChange={onChange}
                  onKeyPress={onKeyPress}
                  placeholder="New Category Name"
                  variant="flushed"
                  value={inputValue}
                />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={() => closeDialogue()}>Cancel</Button>
                <Button
                  isDisabled={!inputValue}
                  colorScheme="green"
                  onClick={createCategory}
                  ml={3}
                >
                  Create
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  )
}
