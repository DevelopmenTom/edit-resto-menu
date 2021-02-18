import { ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'
import * as request from 'supertest'

import { AppModule } from './app.module'
import { createMockMenu } from './menu/testHelpers/createMockMenu'

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
    it('gets a 200', async () => {
      await request(app.getHttpServer()).get('/menu').expect(200)
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
})
