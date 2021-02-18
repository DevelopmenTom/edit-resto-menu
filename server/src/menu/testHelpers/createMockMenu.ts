import * as fs from 'fs'
import { join } from 'path'

import { IMenu } from '../interfaces/IMenu'

export const existingCategoryName = 'firstCategory'

const defaultMockMenu: IMenu = {
  categories: [existingCategoryName, 'secondCategory'],
  items: {
    [existingCategoryName]: [
      { description: 'the first item!', name: 'firstItem', price: '66' }
    ],
    secondCategory: [
      { description: 'second category item!', name: 'firstItem', price: '100' }
    ]
  }
}
export const createMockMenu = (mockMenu?: IMenu) =>
  fs.promises.writeFile(
    join(process.cwd(), 'src', 'menu', 'assets', process.env.MENU_FILENAME),
    JSON.stringify(mockMenu || defaultMockMenu)
  )
