import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { MenuContext } from '../pages/index'
import { killTime } from '../testHelpers/killTime'
import { Login } from './Login'

describe('Login', () => {
  it('renders a Send button once Login button is clicked', () => {
    const initialState = { editMode: false }
    render(
      <MenuContext.Provider value={{ state: initialState } as any}>
        <Login />
      </MenuContext.Provider>
    )

    userEvent.click(screen.getByText('Login'))
    expect(screen.getByText('Send')).toBeInTheDocument()
  })

  it('Dispatches an error message to state in case fetch does not return token', async () => {
    const dispatch = jest.fn().mockResolvedValue(undefined)
    const initialState = { editMode: false }
    render(
      <MenuContext.Provider value={{ dispatch, state: initialState } as any}>
        <Login />
      </MenuContext.Provider>
    )

    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'no token for you!', status: 401 })
    )

    userEvent.click(screen.getByText('Login'))
    userEvent.type(screen.getByPlaceholderText('Password'), 'my password')
    userEvent.click(screen.getByText('Send'))
    await killTime(500) // due to jest mock getting updated too slow
    expect(dispatch).toHaveBeenCalledWith({
      payload: 'no token for you!',
      type: 'SET_ERROR'
    })
  })
})
