import { ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'
import * as request from 'supertest'

import { AppModule } from './app.module'
import { ChangeItemDto } from './menu/dto/changeItem.dto'
import { NewItemDto } from './menu/dto/newItem.dto'
import {
  createMockMenu,
  existingCategoryName,
  existingItemName
} from './menu/testHelpers/createMockMenu'

describe('AppController (e2e)', () => {
  let app

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(process.cwd(), 'test.env')
        }),
        AppModule
      ]
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  const getToken = async () => {
    const correctPassFromTestEnv = '12345'
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ password: correctPassFromTestEnv })
      .expect(201)

    const token = response.body.accessToken
    return token
  }

  describe('/login (POST)', () => {
    it('returns 400 when not supplied with password in request body', async () => {
      await request(app.getHttpServer()).post('/login').expect(400)
    })
    it('returns an accessToken when supplied with the correct password', async () => {
      const token = await getToken()
      expect(token).toBeDefined()
    })
  })

  describe('/menu (Get)', () => {
    it('gets a 200 and the menu in body of response', async () => {
      const res = await request(app.getHttpServer()).get('/menu').expect(200)
      const menu = JSON.parse(res.text)
      expect(menu).toBeDefined()
    })
  })

  describe('/menu/category (Post)', () => {
    it('gets 401 when request has no bearer token', async () => {
      await request(app.getHttpServer()).post('/menu/category').expect(401)
    })

    it('gets 401 when token expired', async () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjowLCJpYXQiOjE2MTM2NzQwMjEsImV4cCI6MTYxMzY3NzYyMX0.sqmMfTpyu0TVLeMuRZQ4nKeR57BhZ6N0xpwu46MbJYQ'
      await request(app.getHttpServer())
        .post('/menu/category')
        .set('Authorization', `bearer ${expiredToken}`)
        .expect(401)
    })

    it('gets 201 and an updated list of categories when everything went alright', async () => {
      await createMockMenu()
      const token = await getToken()

      const response = await request(app.getHttpServer())
        .post('/menu/category')
        .send({ newCategoryName: 'newCatgory' })
        .set('Authorization', `bearer ${token}`)
        .expect(201)

      expect(JSON.parse(response.text)).toEqual([
        'firstCategory',
        'secondCategory',
        'newCatgory'
      ])
    })
  })

  describe('/menu/category (Delete)', () => {
    it('gets 200 and the list of categories without the removed one', async () => {
      await createMockMenu()
      const token = await getToken()

      const response = await request(app.getHttpServer())
        .delete('/menu/category')
        .send({ categoryToRemove: existingCategoryName })
        .set('Authorization', `bearer ${token}`)
        .expect(200)

      expect(JSON.parse(response.text).includes(existingCategoryName)).toBe(
        false
      )
    })
  })

  describe('/menu/category/moveCategoryForward (Put)', () => {
    it('gets 200 and the list of categories with the category moved forward', async () => {
      await createMockMenu()
      const token = await getToken()

      const response = await request(app.getHttpServer())
        .put('/menu/category/moveCategoryForward')
        .send({ categoryToMove: existingCategoryName })
        .set('Authorization', `bearer ${token}`)
        .expect(200)

      expect(JSON.parse(response.text)).toEqual([
        'secondCategory',
        'firstCategory'
      ])
    })
  })

  describe('/menu/category/moveCategoryBack (Put)', () => {
    it('gets 200 and the list of categories with the category moved back', async () => {
      await createMockMenu()
      const token = await getToken()

      const response = await request(app.getHttpServer())
        .put('/menu/category/moveCategoryBack')
        .send({ categoryToMove: 'secondCategory' })
        .set('Authorization', `bearer ${token}`)
        .expect(200)

      expect(JSON.parse(response.text)).toEqual([
        'secondCategory',
        'firstCategory'
      ])
    })
  })

  describe('/menu/item (Post)', () => {
    it('gets 201 and a list of category items including the new item', async () => {
      await createMockMenu()
      const token = await getToken()

      const newItem: NewItemDto = {
        category: existingCategoryName,
        description: 'is super new',
        name: 'newItem!',
        price: '123'
      }

      const response = await request(app.getHttpServer())
        .post('/menu/item')
        .send(newItem)
        .set('Authorization', `bearer ${token}`)
        .expect(201)

      expect(
        JSON.parse(response.text).filter((item) => item.name === newItem.name)
      ).toHaveLength(1)
    })
  })

  describe('/menu/item (Delete)', () => {
    it('gets 200 and a list of category items without the removed item', async () => {
      await createMockMenu()
      const token = await getToken()

      const itemToRemove: ChangeItemDto = {
        category: existingCategoryName,
        name: existingItemName
      }

      const response = await request(app.getHttpServer())
        .delete('/menu/item')
        .send(itemToRemove)
        .set('Authorization', `bearer ${token}`)
        .expect(200)

      expect(
        JSON.parse(response.text).filter(
          (item) => item.name === itemToRemove.name
        )
      ).toHaveLength(0)
    })
  })

  describe('/menu/item/moveItemUp (PUT)', () => {
    it('gets 200 and a list of category items without the removed item', async () => {
      await createMockMenu({
        categories: [existingCategoryName],
        items: {
          [existingCategoryName]: [
            { description: 'the first item!', name: 'firstItem', price: '1' },
            { description: 'the second item!', name: 'secondItem', price: '2' }
          ]
        }
      })
      const token = await getToken()

      const itemToMove: ChangeItemDto = {
        category: existingCategoryName,
        name: 'secondItem'
      }

      const response = await request(app.getHttpServer())
        .put('/menu/item/moveItemUp')
        .send(itemToMove)
        .set('Authorization', `bearer ${token}`)
        .expect(200)

      expect(JSON.parse(response.text)).toEqual([
        { description: 'the second item!', name: 'secondItem', price: '2' },
        { description: 'the first item!', name: 'firstItem', price: '1' }
      ])
    })
  })

  describe('/menu/item/moveItemDown (PUT)', () => {
    it('gets 200 and a list of category items without the removed item', async () => {
      await createMockMenu({
        categories: [existingCategoryName],
        items: {
          [existingCategoryName]: [
            { description: 'the first item!', name: 'firstItem', price: '1' },
            { description: 'the second item!', name: 'secondItem', price: '2' }
          ]
        }
      })
      const token = await getToken()

      const itemToMove: ChangeItemDto = {
        category: existingCategoryName,
        name: 'firstItem'
      }

      const response = await request(app.getHttpServer())
        .put('/menu/item/moveItemDown')
        .send(itemToMove)
        .set('Authorization', `bearer ${token}`)
        .expect(200)

      expect(JSON.parse(response.text)).toEqual([
        { description: 'the second item!', name: 'secondItem', price: '2' },
        { description: 'the first item!', name: 'firstItem', price: '1' }
      ])
    })
  })
})
