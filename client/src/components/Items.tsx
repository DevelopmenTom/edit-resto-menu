import { Box, Heading, Text } from '@chakra-ui/react'
import { Dispatch, useContext } from 'react'

import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages/index'

export const Items = () => {
  const { state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }
  return (
    <section>
      {state.items[state.activeCategory] &&
        state.items[state.activeCategory].map((item) => (
          <Box key={item.name}>
            <Heading>{item.name}</Heading>
            <Text>
              {item.description} / <Text as={'span'}>{item.price}</Text>
            </Text>
          </Box>
        ))}
    </section>
  )
}
