import { IMenu } from '../interfaces/IMenu'
import { IMenuState } from '../interfaces/IMenuState'
import {
  IReducerAction,
  updateItemsPayload
} from '../interfaces/IReducerAction'

export const reducer = (state: IMenuState, action: IReducerAction) => {
  switch (action.type) {
    case 'LOAD_INITIAL_MENU':
      return {
        ...state,
        activeCategory: (action.payload as IMenu).categories[0],
        categories: (action.payload as IMenu).categories,
        items: (action.payload as IMenu).items
      }
    case 'TOGGLE_EDIT_MODE':
      return { ...state, editMode: !state.editMode }
    case 'TOGGLE_SENDING':
      return { ...state, sending: !state.sending }
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload as string }
    case 'SET_ERROR':
      return { ...state, error: action.payload as string }
    case 'UPDATE_CATEGORIES':
      return { ...state, categories: action.payload as string[] }
    case 'UPDATE_ITEMS':
      return {
        ...state,
        items: {
          ...state.items,
          [(action.payload as updateItemsPayload)
            .activeCategory]: (action.payload as updateItemsPayload).items
        }
      }
    default:
      return state
  }
}
