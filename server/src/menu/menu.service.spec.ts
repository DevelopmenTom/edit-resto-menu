import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'

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

    await createMockMenu()
  })

  describe('#addCategory', () => {
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
})
