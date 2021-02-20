import { CategoryItems } from './CategoryItems'

export interface IMenuState {
  activeCategory: string
  categories: string[]
  editMode: boolean
  items: {
    [categoryName: string]: CategoryItems
  }
  sending: boolean
}
