import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

describe('Auth Controller', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(process.cwd(), 'test.env')
        }),
        JwtModule.register({ secret: process.env.SECRET_KEY_JWT })
      ],
      providers: [AuthService]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  describe('#login', () => {
    it('throws an error when not supplied with a password in the DTO', async () => {
      await expect(
        controller.login(({} as unknown) as LoginDto)
      ).rejects.toThrow()
    })

    it('returns accessToken when provided with the correct password', async () => {
      const correctPassFromTestEnv = '12345'
      const res = await controller.login({ password: correctPassFromTestEnv })
      await expect(res.accessToken).toBeDefined()
    })
  })
})
