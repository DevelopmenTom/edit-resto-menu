import { SimpleGrid } from '@chakra-ui/react'
import { Dispatch, useContext } from 'react'

import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages/index'
import { CategoryItem } from './CategoryItem'

export const Categories = () => {
  const { state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }
  return (
    <nav>
      <SimpleGrid columns={[3, null, state.categories.length]} spacing={5}>
        {state.categories.map((category) => (
          <CategoryItem categoryName={category} key={category} />
        ))}
      </SimpleGrid>
    </nav>
  )
}
