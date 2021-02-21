import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  useColorMode
} from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { createContext, Dispatch, useEffect, useMemo, useReducer } from 'react'

import { Categories } from '../components/Categories'
import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { InfoSection } from '../components/InfoSection'
import { Items } from '../components/Items'
import { Loader } from '../components/Loader'
import { Login } from '../components/Login'
import { IMenu } from '../interfaces/IMenu'
import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { loadInitialMenu, setError, toggleEditMode } from '../store/actions'
import { initialState } from '../store/initialState'
import { reducer } from '../store/reducer'

export type Props = {
  initialMenu: IMenu
}

export const MenuContext = createContext<
  { state: IMenuState; dispatch: Dispatch<IReducerAction> } | undefined
>(undefined)

const Index = ({ initialMenu }: Props) => {
  const { colorMode } = useColorMode()
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

  const AlertBgColor = { dark: 'red.900', light: 'red.200' }

  return (
    <MenuContext.Provider value={contextValue}>
      <style jsx global>{`
        html {
          height: 100%;
        }

        #__next {
          height: 100%;
        }
      `}</style>
      <Head>
        <title>Tom's Diner!</title>
        <meta charSet={'UTF-8'} />
      </Head>
      <Container h={'100%'} minHeight={'100vh'}>
        <Box
          as={'main'}
          flex={'1'}
          maxWidth={[null, null, '80%']}
          minWidth={[null, null, '40%']}
        >
          {state.error && (
            <Alert
              bg={AlertBgColor[colorMode]}
              position={'fixed'}
              top={'1rem'}
              zIndex={'2000'}
              status={'error'}
              maxWidth={[null, null, '80%']}
            >
              <AlertIcon />
              <AlertTitle mr={2}>{state.error}</AlertTitle>
              <CloseButton
                position="absolute"
                right="2px"
                top="2px"
                onClick={() => dispatch(setError(''))}
              />
            </Alert>
          )}
          <DarkModeSwitch />
          <InfoSection />
          <Categories />
          <Items />
        </Box>
        <footer style={{ flexShrink: 0 }}>
          <Login />
        </footer>
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
