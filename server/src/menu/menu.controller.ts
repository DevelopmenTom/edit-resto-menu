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

@Controller('menu')
export class MenuController {
  @Get('/')
  getMenu(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json({ categories: ['burger', 'sides', 'deserts', 'drinks'] })
  }

  @UseGuards(JWTGuard)
  @Post('category')
  addCategory(@Res() res: Response) {
    return res.status(HttpStatus.CREATED).json({ result: 'category created' })
  }
}
