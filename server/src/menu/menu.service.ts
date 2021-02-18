import { HttpException, Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { join } from 'path'

import { IMenu } from './interfaces/IMenu'

@Injectable()
export class MenuService {
  public async addCategory(newCategoryName: string): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()

    if (currentMenu.categories.includes(newCategoryName)) {
      throw new HttpException('category already exists in menu', 401)
    }

    const updatedMenu: IMenu = {
      categories: [...currentMenu.categories, newCategoryName],
      items: { ...currentMenu.items, newCategoryName: [] }
    }

    await this.saveMenuToFile(updatedMenu)
  }

  private async fetchMenuFromFile(): Promise<IMenu> {
    const mockMenuJSON = await fs.promises.readFile(
      join(process.cwd(), 'src', 'menu', 'assets', process.env.MENU_FILENAME),
      'utf8'
    )
    return JSON.parse(mockMenuJSON)
  }

  private async saveMenuToFile(updatedMenu: IMenu): Promise<void> {
    return fs.promises.writeFile(
      join(process.cwd(), 'src', 'menu', 'assets', process.env.MENU_FILENAME),
      JSON.stringify(updatedMenu)
    )
  }
}
