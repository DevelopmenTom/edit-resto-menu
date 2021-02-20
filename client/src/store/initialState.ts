import { IMenuState } from '../interfaces/IMenuState'

export const initialState: IMenuState = {
  activeCategory: '',
  categories: [],
  editMode: false,
  items: {},
  sending: false
}
