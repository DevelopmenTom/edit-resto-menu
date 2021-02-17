import { ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'
import * as request from 'supertest'

import { AppModule } from './app.module'

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

  describe('/login (POST)', () => {
    it('returns 400 when not supplied with password in request body', async () => {
      await request(app.getHttpServer()).post('/login').expect(400)
    })
    it('returns an accessToken when supplied with the correct password', async () => {
      const correctPassFromTestEnv = '12345'
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({ password: correctPassFromTestEnv })
        .expect(201)

      expect(response.text.includes('accessToken')).toBe(true)
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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjowLCJpYXQiOjE2MTM1OTQ2NzEsImV4cCI6MTYxMzU5NDY3NH0.WMOHxmK0SchSfQzGOo97fUSZu8c3NlEVUQ-eyrtB63A'
      await request(app.getHttpServer())
        .post('/menu/category')
        .set('Authorization', `bearer ${expiredToken}`)
        .expect(401)
    })
  })
})
