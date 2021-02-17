import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthService } from '../auth.service'
import { JwtPayload } from '../interfaces/jwt.payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY_JWT
    })
  }

  async validate(payload: JwtPayload) {
    const authorized = await this.authService.validateJwt(payload)

    if (!authorized) {
      throw new UnauthorizedException()
    }

    return {}
  }
}
