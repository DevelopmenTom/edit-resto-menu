import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_KEY } from './decorators/Public'

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }

  handleRequest(err, user, info: Error) {
    if (info && info.message === 'No auth token') {
      throw new UnauthorizedException()
    }

    if (info && info.message === 'jwt expired') {
      throw new HttpException('Token expired', 401)
    }

    if (err || info || !user) {
      throw err || info || new UnauthorizedException()
    }

    return user
  }
}
