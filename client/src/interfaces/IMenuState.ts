import { ICategoryItem } from './ICategoryItem'

export interface IMenuState {
  activeCategory: string
  categories: string[]
  editMode: boolean
  error?: string
  items: {
    [categoryName: string]: ICategoryItem[]
  }
  sending: boolean
}
