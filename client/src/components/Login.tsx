import { Button, HStack, Input } from '@chakra-ui/react'
import { Dispatch, FormEvent, KeyboardEvent, useContext, useState } from 'react'

import { createApiRequest } from '../helpers/createApiRequest'
import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages'
import { setError, toggleEditMode, toggleSending } from '../store/actions'

export const Login = () => {
  const { dispatch, state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  const [formVisible, setFromVisible] = useState(false)
  const [inputValue, setInputValue] = useState<string>('')

  const clearForm = () => {
    setFromVisible(!formVisible)
    setInputValue('')
    setError('')
  }

  const onChange = (event: FormEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value)
  }

  const onKeyPress = (event: KeyboardEvent) => {
    dispatch(setError(''))
    if (event.key === 'Enter') {
      login()
    }
  }

  const login = async () => {
    dispatch(setError(''))
    dispatch(toggleSending())
    const loginRequest = createApiRequest({
      body: { password: inputValue },
      endpoint: 'login',
      method: 'POST'
    })

    try {
      const rawResponse = await loginRequest
      const response = await rawResponse.json()
      if (!response.accessToken) {
        dispatch(setError(response.message))
        return
      }
      localStorage.setItem('token', response.accessToken)
      dispatch(toggleEditMode())
      clearForm()
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(toggleSending())
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch(toggleEditMode())
  }

  return (
    <>
      <HStack spacing="10px">
        <Button
          onClick={() => {
            if (state.editMode) {
              logout()
              return
            }
            clearForm()
          }}
          variant="ghost"
        >
          {state.editMode ? 'Logout' : formVisible ? 'Cancel' : 'Login'}
        </Button>
        <Input
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Password"
          variant="flushed"
          value={inputValue}
          visibility={formVisible ? 'visible' : 'hidden'}
        />
        <Button
          isDisabled={!inputValue}
          onClick={login}
          variant="ghost"
          visibility={formVisible ? 'visible' : 'hidden'}
        >
          Send
        </Button>
      </HStack>
    </>
  )
}
