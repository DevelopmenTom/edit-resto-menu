import * as fs from 'fs'
import { join } from 'path'

import { IMenu } from '../interfaces/IMenu'

export const readMockMenu = async (): Promise<IMenu> => {
  const mockMenuJSON = await fs.promises.readFile(
    join(process.cwd(), 'src', 'menu', 'assets', process.env.MENU_FILENAME),
    'utf8'
  )
  return JSON.parse(mockMenuJSON)
}
