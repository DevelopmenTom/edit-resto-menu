import { IMenu } from '../interfaces/IMenu'
import { IReducerAction } from '../interfaces/IReducerAction'

export const loadInitialMenu = (initialMenu: IMenu): IReducerAction => ({
  payload: initialMenu,
  type: 'LOAD_INITIAL_MENU'
})

export const toggleEditMode = (): IReducerAction => ({
  type: 'TOGGLE_EDIT_MODE'
})

export const toggleSending = (): IReducerAction => ({
  type: 'TOGGLE_SENDING'
})

export const setActiveCategory = (categoryName: string): IReducerAction => ({
  payload: categoryName,
  type: 'SET_ACTIVE_CATEGORY'
})

export const setError = (errorMessage: string): IReducerAction => ({
  payload: errorMessage,
  type: 'SET_ERROR'
})

export const updateCategories = (categories: string[]): IReducerAction => ({
  payload: categories,
  type: 'UPDATE_CATEGORIES'
})
