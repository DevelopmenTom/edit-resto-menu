import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async login(
    @Body() loginDto: LoginDto
  ): Promise<{ accessToken: string }> {
    return await this.authService.login(loginDto)
  }
}
