import { ICategoryItem } from './ICategoryItem'
import { IMenu } from './IMenu'

export type updateItemsPayload = {
  activeCategory: string
  items: ICategoryItem[]
}

export interface IReducerAction {
  type: string
  payload?: string | boolean | string[] | updateItemsPayload | IMenu
}
