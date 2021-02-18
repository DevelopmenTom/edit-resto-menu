import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
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

  @UseGuards(JWTGuard)
  @Delete('category')
  public async removeCategoey(
    @Body() { categoryToRemove }: { categoryToRemove: string },
    @Res() res: Response
  ) {
    await this.menuService.removeCategoey(categoryToRemove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res.status(HttpStatus.OK).json(updatedMenu.categories)
  }

  @UseGuards(JWTGuard)
  @Put('category/moveCategoryForward')
  public async moveCategoryForward(
    @Body() { categoryToMove }: { categoryToMove: string },
    @Res() res: Response
  ) {
    await this.menuService.moveCategoryForward(categoryToMove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res.status(HttpStatus.OK).json(updatedMenu.categories)
  }

  @UseGuards(JWTGuard)
  @Put('category/moveCategoryBack')
  public async moveCategoryBack(
    @Body() { categoryToMove }: { categoryToMove: string },
    @Res() res: Response
  ) {
    await this.menuService.moveCategoryBack(categoryToMove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res.status(HttpStatus.OK).json(updatedMenu.categories)
  }
}
