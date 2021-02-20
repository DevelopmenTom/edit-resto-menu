import { CategoryItems } from './CategoryItems'

export interface IMenu {
  categories: string[]
  items: {
    [categoryName: string]: CategoryItems
  }
}
