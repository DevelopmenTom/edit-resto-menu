import { SimpleGrid } from '@chakra-ui/react'
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

  const wideScreenGridSize = () => {
    return state.editMode
      ? state.categories.length + 1
      : state.categories.length
  }
  return (
    <nav>
      <SimpleGrid columns={[3, null, wideScreenGridSize()]} spacing={5}>
        {state.categories.map((category, index) => (
          <Category
            categoryName={category}
            isFirst={index === 0}
            isLast={index === state.categories.length - 1}
            key={category}
          />
        ))}
        {state.editMode && <AddCategory />}
      </SimpleGrid>
    </nav>
  )
}
