import { Button, VStack } from '@chakra-ui/react'
import { Dispatch, useContext } from 'react'

import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages'
import { setActiveCategory } from '../store/actions'

export type Props = {
  categoryName: string
}

export const CategoryItem = ({ categoryName }: Props) => {
  const { dispatch, state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  return (
    <VStack spacing={'5px'}>
      <Button
        onClick={() => dispatch(setActiveCategory(categoryName))}
        variant={state.activeCategory === categoryName ? 'solid' : 'outline'}
      >
        {categoryName}
      </Button>
    </VStack>
  )
}
