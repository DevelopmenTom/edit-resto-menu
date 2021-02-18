import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { Public } from './decorators/Public'
import { LoginDto } from './dto/login.dto'

@Controller('/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  public async login(
    @Body() loginDto: LoginDto
  ): Promise<{ accessToken: string }> {
    return await this.authService.login(loginDto)
  }
}
