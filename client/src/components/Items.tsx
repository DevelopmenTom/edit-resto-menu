import { Dispatch, useContext } from 'react'

import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'
import { MenuContext } from '../pages/index'
import { Item } from './Item'

export const Items = () => {
  const { state } = useContext(MenuContext) as {
    state: IMenuState
    dispatch: Dispatch<IReducerAction>
  }
  return (
    <section>
      {state.items[state.activeCategory] &&
        state.items[state.activeCategory].map((item, index) => (
          <Item
            key={item.name}
            item={item}
            isFirst={index === 0}
            isLast={index === state.items[state.activeCategory].length - 1}
          />
        ))}
    </section>
  )
}
