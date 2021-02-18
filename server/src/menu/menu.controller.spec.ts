import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { Response } from 'express'
import { join } from 'path'

import { MenuController } from './menu.controller'
import { MenuService } from './menu.service'
import { createMockMenu } from './testHelpers/createMockMenu'

describe('MenuController', () => {
  let controller: MenuController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(process.cwd(), 'test.env')
        })
      ],
      providers: [MenuService]
    }).compile()

    controller = module.get<MenuController>(MenuController)

    await createMockMenu()
  })

  describe('#addCategory', () => {
    it('returns the updated list of categories', async () => {
      const res = await controller.addCategory(
        { newCategoryName: 'newCatgory' },
        ({
          status: jest.fn().mockReturnValue({
            json: (responseBody) => responseBody
          })
        } as unknown) as Response
      )

      expect(res).toEqual(['firstCategory', 'secondCategory', 'newCatgory'])
    })
  })
})
