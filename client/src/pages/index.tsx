import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { createContext, Dispatch, useEffect, useMemo, useReducer } from 'react'

import { Categories } from '../components/Categories'
import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Items } from '../components/Items'
import { Loader } from '../components/Loader'
import { Login } from '../components/Login'
import { IMenu } from '../interfaces/IMenu'
import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { loadInitialMenu, toggleEditMode } from '../store/actions'
import { initialState } from '../store/initialState'
import { reducer } from '../store/reducer'

export type Props = {
  initialMenu: IMenu
}

export const MenuContext = createContext<
  { state: IMenuState; dispatch: Dispatch<IReducerAction> } | undefined
>(undefined)

const Index = ({ initialMenu }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch(loadInitialMenu(initialMenu))

    const token = localStorage.getItem('token')
    if (token) {
      dispatch(toggleEditMode())
    }
  }, [initialMenu])

  const contextValue = useMemo(() => {
    return { dispatch, state }
  }, [dispatch, state])

  return (
    <MenuContext.Provider value={contextValue}>
      <Container minH={'100vh'}>
        <Head>
          <title>Tom's Diner!</title>
        </Head>
        <DarkModeSwitch />
        {state.error && (
          <Alert status={'error'}>
            <AlertIcon />
            <AlertTitle mr={2}>{state.error}</AlertTitle>
          </Alert>
        )}
        <Categories />
        <Items />
        <Login />
      </Container>
      {state.sending && <Loader />}
    </MenuContext.Provider>
  )
}

export default Index

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: { initialMenu: IMenu }
  revalidate: number
}> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/menu`)
  const data = await res.json()

  return {
    props: { initialMenu: data },
    revalidate: 1
  }
}
