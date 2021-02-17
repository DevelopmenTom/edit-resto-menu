import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'

import { AuthService } from './auth.service'
import { Role } from './interfaces/jwt.payload'

describe('AuthService', () => {
  let service: AuthService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(process.cwd(), 'test.env')
        }),
        JwtModule.register({ secret: process.env.SECRET_KEY_JWT })
      ],
      providers: [AuthService]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  describe('#login', () => {
    it('Returns Auth error response when provided with wrong password', async () => {
      await expect(
        service.login({ password: 'wrong password' })
      ).rejects.toThrow('Authentication failed. Wrong password')
    })

    it('returns accessToken when provided with the correct password', async () => {
      const correctPassFromTestEnv = '12345'
      const res = await service.login({ password: correctPassFromTestEnv })
      await expect(res.accessToken).toBeDefined()
    })
  })

  describe('#validateJwt', () => {
    it('throws an UnauthorizedException when passed a non-admin role', async () => {
      await expect(
        service.validateJwt({ role: Role.NONADMIN })
      ).rejects.toThrow('Unauthorized')
    })

    it('returns the string "Autohrized" when passed an Admin role', async () => {
      await expect(service.validateJwt({ role: Role.ADMIN })).resolves.toEqual(
        'Autohrized'
      )
    })
  })
})
