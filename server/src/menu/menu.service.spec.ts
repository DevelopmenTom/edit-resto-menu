import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'

import { ChangeItemDto } from './dto/changeItem.dto'
import { NewItemDto } from './dto/newItem.dto'
import { IMenu } from './interfaces/IMenu'
import { MenuService } from './menu.service'
import {
  createMockMenu,
  existingCategoryName,
  existingItemName
} from './testHelpers/createMockMenu'
import { readMockMenu } from './testHelpers/readMockMenu'

describe('MenuService', () => {
  let service: MenuService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(process.cwd(), 'test.env')
        })
      ],
      providers: [MenuService]
    }).compile()

    service = module.get<MenuService>(MenuService)
  })

  describe('#addCategory', () => {
    beforeEach(async () => {
      await createMockMenu()
    })

    it('throws an error in case category already exists', async () => {
      await expect(service.addCategory(existingCategoryName)).rejects.toThrow(
        'category already exists in menu'
      )
    })

    it('adds a category to the menu object', async () => {
      await service.addCategory('newCategoryName')

      const updatedMenu = await readMockMenu()
      expect(updatedMenu.categories.includes('newCategoryName')).toBe(true)
      expect(updatedMenu.items['newCategoryName']).toBeDefined()
    })
  })

  describe('#removeCategoey', () => {
    it('throws an error in case there is just one category', async () => {
      const categoryName = 'justOne'
      const justOneCategory: IMenu = {
        categories: [categoryName],
        items: { [categoryName]: [] }
      }
      await createMockMenu(justOneCategory)

      await expect(service.removeCategoey(categoryName)).rejects.toThrow(
        'cannot remove the last category'
      )
    })

    it('removes category from menu object when it is not the only one', async () => {
      await createMockMenu()

      await service.removeCategoey(existingCategoryName)

      const updatedMenu = await readMockMenu()
      expect(updatedMenu.categories.includes(existingCategoryName)).toBe(false)
      expect(updatedMenu.items[existingCategoryName]).toBeUndefined()
    })
  })

  describe('#moveCategoryBack', () => {
    beforeEach(async () => {
      const threeCategories: IMenu = {
        categories: ['first', 'second', 'third'],
        items: { first: [], second: [], third: [] }
      }
      await createMockMenu(threeCategories)
    })
    it('moves the requested category one place back in the category array', async () => {
      await service.moveCategoryBack('second')

      const updatedMenu = await readMockMenu()
      expect(updatedMenu.categories).toEqual(['second', 'first', 'third'])
    })

    it('has no effect if category is already the first one', async () => {
      await service.moveCategoryBack('first')

      const updatedMenu = await readMockMenu()
      expect(updatedMenu.categories).toEqual(['first', 'second', 'third'])
    })
  })

  describe('#moveCategoryForward', () => {
    beforeEach(async () => {
      const threeCategories: IMenu = {
        categories: ['first', 'second', 'third'],
        items: { first: [], second: [], third: [] }
      }
      await createMockMenu(threeCategories)
    })
    it('moves the requested category one place forward in the category array', async () => {
      await service.moveCategoryForward('second')

      const updatedMenu = await readMockMenu()
      expect(updatedMenu.categories).toEqual(['first', 'third', 'second'])
    })

    it('has no effect if category is already the last one', async () => {
      await service.moveCategoryForward('third')

      const updatedMenu = await readMockMenu()
      expect(updatedMenu.categories).toEqual(['first', 'second', 'third'])
    })
  })

  describe('#addItem', () => {
    beforeEach(async () => {
      await createMockMenu()
    })

    it('throws an error when supplied with an item name which already exists in the category', async () => {
      const newItem: NewItemDto = {
        category: existingCategoryName,
        description: 'this name already exists in this category',
        name: existingItemName,
        price: '100'
      }

      await expect(service.addItem(newItem)).rejects.toThrow(
        'this item name already exists in this category'
      )
    })

    it('adds an item to a specific category when item name does not exists in the category', async () => {
      const newItem: NewItemDto = {
        category: existingCategoryName,
        description: 'a new item',
        name: 'newItem',
        price: '100'
      }

      await service.addItem(newItem)
      const updatedMenu = await readMockMenu()
      const theItemAdded = updatedMenu.items[existingCategoryName].filter(
        (item) => item.name === newItem.name
      )
      expect(theItemAdded.length).toBe(1)
    })
  })

  describe('#removeItem', () => {
    it('removes the requested item from the requested category', async () => {
      const itemToRemove: ChangeItemDto = {
        category: existingCategoryName,
        name: existingItemName
      }

      await service.removeItem(itemToRemove)

      const updatedMenu = await readMockMenu()
      const removedItem = updatedMenu.items[existingCategoryName].filter(
        (item) => item.name === existingItemName
      )
      expect(removedItem.length).toBe(0)
    })
  })

  describe('#moveItemUp', () => {
    beforeEach(async () => {
      const categoryWithThreeItems: IMenu = {
        categories: [existingCategoryName],
        items: {
          [existingCategoryName]: [
            { description: 'the first item!', name: 'firstItem', price: '1' },
            { description: 'the second item!', name: 'secondItem', price: '2' },
            { description: 'the third item!', name: 'thirdItem', price: '3' }
          ]
        }
      }
      await createMockMenu(categoryWithThreeItems)
    })

    it('has no effect when the requested item is already first in the array', async () => {
      const itemToMove: ChangeItemDto = {
        category: existingCategoryName,
        name: 'firstItem'
      }
      await service.moveItemUp(itemToMove)

      const updatedMenu = await readMockMenu()
      const itemsInCategory = updatedMenu.items[existingCategoryName]

      expect(itemsInCategory).toEqual([
        { description: 'the first item!', name: 'firstItem', price: '1' },
        { description: 'the second item!', name: 'secondItem', price: '2' },
        { description: 'the third item!', name: 'thirdItem', price: '3' }
      ])
    })

    it('moves the requested item one place backwards in the category array', async () => {
      const itemToMove: ChangeItemDto = {
        category: existingCategoryName,
        name: 'secondItem'
      }
      await service.moveItemUp(itemToMove)

      const updatedMenu = await readMockMenu()
      const itemsInCategory = updatedMenu.items[existingCategoryName]

      expect(itemsInCategory).toEqual([
        { description: 'the second item!', name: 'secondItem', price: '2' },
        { description: 'the first item!', name: 'firstItem', price: '1' },
        { description: 'the third item!', name: 'thirdItem', price: '3' }
      ])
    })
  })

  describe('#moveItemDown', () => {
    beforeEach(async () => {
      const categoryWithThreeItems: IMenu = {
        categories: [existingCategoryName],
        items: {
          [existingCategoryName]: [
            { description: 'the first item!', name: 'firstItem', price: '1' },
            { description: 'the second item!', name: 'secondItem', price: '2' },
            { description: 'the third item!', name: 'thirdItem', price: '3' }
          ]
        }
      }
      await createMockMenu(categoryWithThreeItems)
    })

    it('has no effect when the requested item is already last in the array', async () => {
      const itemToMove: ChangeItemDto = {
        category: existingCategoryName,
        name: 'thirdItem'
      }
      await service.moveItemDown(itemToMove)

      const updatedMenu = await readMockMenu()
      const itemsInCategory = updatedMenu.items[existingCategoryName]

      expect(itemsInCategory).toEqual([
        { description: 'the first item!', name: 'firstItem', price: '1' },
        { description: 'the second item!', name: 'secondItem', price: '2' },
        { description: 'the third item!', name: 'thirdItem', price: '3' }
      ])
    })

    it('moves the requested item one place forwards in the category array', async () => {
      const itemToMove: ChangeItemDto = {
        category: existingCategoryName,
        name: 'secondItem'
      }
      await service.moveItemDown(itemToMove)

      const updatedMenu = await readMockMenu()
      const itemsInCategory = updatedMenu.items[existingCategoryName]

      expect(itemsInCategory).toEqual([
        { description: 'the first item!', name: 'firstItem', price: '1' },
        { description: 'the third item!', name: 'thirdItem', price: '3' },
        { description: 'the second item!', name: 'secondItem', price: '2' }
      ])
    })
  })
})
