import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards
} from '@nestjs/common'
import { Response } from 'express'

import { JWTGuard } from '../auth/jwt.guard'
import { MenuService } from './menu.service'

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/')
  async getMenu(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(await this.menuService.fetchMenuFromFile())
  }

  @UseGuards(JWTGuard)
  @Post('category')
  addCategory(@Res() res: Response) {
    return res.status(HttpStatus.CREATED).json({ result: 'category created' })
  }
}
