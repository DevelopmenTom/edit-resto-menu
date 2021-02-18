import {
  Body,
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
  public async getMenu(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(await this.menuService.fetchMenuFromFile())
  }

  @UseGuards(JWTGuard)
  @Post('category')
  public async addCategory(
    @Body() { newCategoryName }: { newCategoryName: string },
    @Res() res: Response
  ) {
    await this.menuService.addCategory(newCategoryName)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res.status(HttpStatus.CREATED).json(updatedMenu.categories)
  }
}
