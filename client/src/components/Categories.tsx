import { HStack } from '@chakra-ui/react'
import { Dispatch, useContext } from 'react'

import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages/index'
import { AddCategory } from './AddCategory'
import { Category } from './Category'

export const Categories = () => {
  const { state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  return (
    <nav>
      <HStack p={'10px'} maxW={'100vw'} overflowX={['scroll', null, 'auto']}>
        {state.categories.map((category, index) => (
          <Category
            categoryName={category}
            isFirst={index === 0}
            isLast={index === state.categories.length - 1}
            key={category}
          />
        ))}
        {state.editMode && <AddCategory />}
      </HStack>
    </nav>
  )
}
