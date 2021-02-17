import {
  HttpException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { LoginDto } from './dto/login.dto'
import { JwtPayload, Role } from './interfaces/jwt.payload'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async login(
    loginDto: LoginDto
  ): Promise<any | { status: number; message: string }> {
    const passwordIsValid = bcrypt.compareSync(
      loginDto.password,
      process.env.ADMIN_PASS
    )

    if (!passwordIsValid == true) {
      throw new HttpException('Authentication failed. Wrong password', 401)
    }

    const payload = {
      role: Role.ADMIN
    }

    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken
    }
  }

  public async validateJwt(payload: JwtPayload) {
    if (payload.role !== Role.ADMIN) {
      throw new UnauthorizedException()
    }

    return 'Autohrized'
  }
}
