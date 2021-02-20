import { IMenu } from '../interfaces/IMenu'
import { IReducerAction } from '../interfaces/IReducerAction'

export const loadInitialMenu = (initialMenu: IMenu): IReducerAction => ({
  payload: initialMenu,
  type: 'LOAD_INITIAL_MENU'
})

export const setActiveCategory = (categoryName: string): IReducerAction => ({
  payload: categoryName,
  type: 'SET_ACTIVE_CATEGORY'
})
