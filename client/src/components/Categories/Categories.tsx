import { HStack } from '@chakra-ui/react'
import { Dispatch, useContext } from 'react'

import { IMenuState } from '../../interfaces/IMenuState'
import { IReducerAction } from '../../interfaces/IReducerAction'
import { MenuContext } from '../../pages/index'
import { AddCategory } from '../AddCategory'
import { Category } from './Category'

export const Categories = () => {
  const { state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }

  return (
    <nav>
      <div
        id="hide-scrollbar"
        style={{ height: '95px', overflowY: 'hidden', width: '100%' }}
      >
        <HStack
          p={'10px'}
          maxW={'100vw'}
          overflowX={'auto'}
          overflowY={'hidden'}
          paddingBottom={'30px'}
        >
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
      </div>
    </nav>
  )
}
