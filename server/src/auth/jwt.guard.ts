import {
  HttpException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
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
