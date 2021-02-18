import { HttpException, Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { join } from 'path'

import { ChangeItemDto } from './dto/changeItem.dto'
import { NewItemDto } from './dto/newItem.dto'
import { IMenu } from './interfaces/IMenu'

@Injectable()
export class MenuService {
  public async addCategory(newCategoryName: string): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()

    if (currentMenu.categories.includes(newCategoryName)) {
      throw new HttpException('category already exists in menu', 400)
    }

    const updatedMenu: IMenu = {
      categories: [...currentMenu.categories, newCategoryName],
      items: { ...currentMenu.items, [newCategoryName]: [] }
    }

    await this.saveMenuToFile(updatedMenu)
  }

  public async removeCategoey(categoryToRemove: string): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()
    if (currentMenu.categories.length === 1) {
      throw new HttpException('cannot remove the last category', 400)
    }

    delete currentMenu.items[categoryToRemove]

    const updatedMenu: IMenu = {
      categories: currentMenu.categories.filter(
        (category) => category !== categoryToRemove
      ),
      items: currentMenu.items
    }

    await this.saveMenuToFile(updatedMenu)
  }

  public async moveCategoryBack(categoryToMove: string): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()

    const indexOfCategoryToMove = currentMenu.categories.indexOf(categoryToMove)

    if (indexOfCategoryToMove === 0) {
      return
    }

    currentMenu.categories.splice(
      indexOfCategoryToMove - 1,
      0,
      currentMenu.categories.splice(indexOfCategoryToMove, 1)[0]
    )

    await this.saveMenuToFile(currentMenu)
  }

  public async moveCategoryForward(categoryToMove: string): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()

    const indexOfCategoryToMove = currentMenu.categories.indexOf(categoryToMove)

    if (indexOfCategoryToMove === currentMenu.categories.length - 1) {
      return
    }

    currentMenu.categories.splice(
      indexOfCategoryToMove + 1,
      0,
      currentMenu.categories.splice(indexOfCategoryToMove, 1)[0]
    )

    await this.saveMenuToFile(currentMenu)
  }

  public async addItem(newItem: NewItemDto): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()

    const existingItems = currentMenu.items[newItem.category].filter(
      (item) => item.name === newItem.name
    )
    const itemAlreadyExistsInCategory = existingItems.length !== 0
    if (itemAlreadyExistsInCategory) {
      throw new HttpException(
        'this item name already exists in this category',
        400
      )
    }

    const { category, ...rest } = newItem

    const updatedMenu: IMenu = {
      ...currentMenu,
      items: {
        ...currentMenu.items,
        [category]: [...currentMenu.items[category], rest]
      }
    }
    await this.saveMenuToFile(updatedMenu)
  }

  public async removeItem(itemToRemove: ChangeItemDto): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()

    const { category, name } = itemToRemove

    const updatedMenu: IMenu = {
      ...currentMenu,
      items: {
        ...currentMenu.items,
        [category]: currentMenu.items[category].filter(
          (item) => item.name !== name
        )
      }
    }
    await this.saveMenuToFile(updatedMenu)
  }

  public async moveItemUp(itemToMove: ChangeItemDto): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()
    const { category, name } = itemToMove

    const fullItemToMove = currentMenu.items[category].filter(
      (item) => item.name === name
    )[0]
    const indexOfItemToMove = currentMenu.items[category].indexOf(
      fullItemToMove
    )

    if (indexOfItemToMove === 0) {
      return
    }

    const itemItself = currentMenu.items[category].splice(
      indexOfItemToMove,
      1
    )[0]
    currentMenu.items[category].splice(indexOfItemToMove - 1, 0, itemItself)
    await this.saveMenuToFile(currentMenu)
  }

  public async moveItemDown(itemToMove: ChangeItemDto): Promise<void> {
    const currentMenu = await this.fetchMenuFromFile()
    const { category, name } = itemToMove

    const fullItemToMove = currentMenu.items[category].filter(
      (item) => item.name === name
    )[0]
    const indexOfItemToMove = currentMenu.items[category].indexOf(
      fullItemToMove
    )

    const itemIsAlreadyLast =
      indexOfItemToMove === currentMenu.items[category].length - 1
    if (itemIsAlreadyLast) {
      return
    }

    const itemItself = currentMenu.items[category].splice(
      indexOfItemToMove,
      1
    )[0]
    currentMenu.items[category].splice(indexOfItemToMove + 1, 0, itemItself)
    await this.saveMenuToFile(currentMenu)
  }

  public async fetchMenuFromFile(): Promise<IMenu> {
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
