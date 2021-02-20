import { CategoryItems } from './CategoryItems'
import { IMenu } from './IMenu'

export interface IReducerAction {
  type: string
  payload: string | boolean | string[] | CategoryItems | IMenu
}
