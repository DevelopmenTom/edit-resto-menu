import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'

import { IMenu } from './interfaces/IMenu'
import { MenuService } from './menu.service'
import {
  createMockMenu,
  existingCategoryName
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
})
