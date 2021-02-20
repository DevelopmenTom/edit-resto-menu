import { IMenu } from '../interfaces/IMenu'
import { IMenuState } from '../interfaces/IMenuState'
import { IReducerAction } from '../interfaces/IReducerAction'

export const reducer = (state: IMenuState, action: IReducerAction) => {
  switch (action.type) {
    case 'LOAD_INITIAL_MENU':
      return {
        ...state,
        activeCategory: (action.payload as IMenu).categories[0],
        categories: (action.payload as IMenu).categories,
        items: (action.payload as IMenu).items
      }
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload as string }
    default:
      return state
  }
}
