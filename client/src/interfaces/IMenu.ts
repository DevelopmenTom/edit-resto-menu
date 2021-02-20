import { ICategoryItem } from './ICategoryItem'

export interface IMenu {
  categories: string[]
  items: {
    [categoryName: string]: ICategoryItem[]
  }
}
