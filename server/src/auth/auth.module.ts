import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { join } from 'path'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JWTGuard } from './jwt.guard'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? join(process.cwd(), 'test.env')
          : undefined
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: '3600s'
      }
    })
  ],
  providers: [AuthService, JwtStrategy, JWTGuard]
})
export class AuthModule {}
