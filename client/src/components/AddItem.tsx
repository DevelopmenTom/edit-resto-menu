import { StarIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Text
} from '@chakra-ui/react'
import { Dispatch, FormEvent, useContext, useState } from 'react'

import { createAuthApiRequest } from '../helpers/createApiRequest'
import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages'
import {
  setError,
  toggleEditMode,
  toggleSending,
  updateItems
} from '../store/actions'

export const AddItem = () => {
  const { dispatch, state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  const [showDialogue, setShowDialogue] = useState(false)
  const [inputValues, setInputValues] = useState({
    description: '',
    name: '',
    price: ''
  })

  const closeDialogue = () => {
    setShowDialogue(false)
    setInputValues({
      description: '',
      name: '',
      price: ''
    })
  }

  const tokenExpired = () => {
    dispatch(setError('Session Expired, please login again'))
    dispatch(toggleEditMode())
    localStorage.removeItem('token')
  }

  const createItem = async () => {
    dispatch(toggleSending())
    dispatch(setError(''))

    const createItemRequest = await createAuthApiRequest({
      body: { ...inputValues, category: state.activeCategory },
      endpoint: 'menu/item',
      method: 'POST'
    })

    try {
      const rawResponse = await createItemRequest
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

      dispatch(updateItems(state.activeCategory, response))
      closeDialogue()
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(toggleSending())
    }
  }

  const updateInputValue = (event: FormEvent<HTMLInputElement>) => {
    console.log({
      name: event.currentTarget.name,
      value: event.currentTarget.value
    })
    setInputValues({
      ...inputValues,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }

  const disableButton =
    !inputValues.description || !inputValues.name || !inputValues.price

  return (
    <>
      <HStack spacing={'2px'}>
        <StarIcon />
        <Box
          color={'green'}
          cursor={'pointer'}
          onClick={() => setShowDialogue(true)}
        >
          <Heading>Create Item</Heading>
          <Text>Click here to add new Item to the categoey</Text>
        </Box>
      </HStack>
      {showDialogue && (
        <AlertDialog
          isOpen={true}
          leastDestructiveRef={undefined}
          onClose={() => closeDialogue()}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                All Fields are mandatory
              </AlertDialogHeader>

              <AlertDialogBody>
                <Input
                  onChange={updateInputValue}
                  name={'name'}
                  placeholder="New Unique Item name"
                  variant="flushed"
                  value={inputValues.name}
                />
                <Input
                  onChange={updateInputValue}
                  name={'description'}
                  placeholder="New Item description"
                  variant="flushed"
                  value={inputValues.description}
                />
                <Input
                  onChange={updateInputValue}
                  name={'price'}
                  placeholder="New Item price"
                  variant="flushed"
                  value={inputValues.price}
                />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={() => closeDialogue()}>Cancel</Button>
                <Button
                  isDisabled={disableButton}
                  colorScheme="green"
                  onClick={createItem}
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
