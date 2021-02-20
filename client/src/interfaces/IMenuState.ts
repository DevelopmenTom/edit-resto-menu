import { CategoryItems } from './CategoryItems'

export interface IMenuState {
  activeCategory: string
  categories: string[]
  items: {
    [categoryName: string]: CategoryItems
  }
}
