import * as fs from 'fs'
import { join } from 'path'

import { IMenu } from '../interfaces/IMenu'

export const existingCategoryName = 'firstCategory'

const mockMenu: IMenu = {
  categories: [existingCategoryName],
  items: {
    [existingCategoryName]: [
      { description: 'the first item!', name: 'firstItem', price: '66' }
    ]
  }
}
export const createMockMenu = () =>
  fs.promises.writeFile(
    join(process.cwd(), 'src', 'menu', 'assets', process.env.MENU_FILENAME),
    JSON.stringify(mockMenu)
  )
