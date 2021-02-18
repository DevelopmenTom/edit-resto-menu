import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Res
} from '@nestjs/common'
import { Response } from 'express'

import { Public } from '../auth/decorators/Public'
import { ChangeItemDto } from './dto/changeItem.dto'
import { NewItemDto } from './dto/newItem.dto'
import { MenuService } from './menu.service'

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get('/')
  public async getMenu(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(await this.menuService.fetchMenuFromFile())
  }

  @Post('category')
  public async addCategory(
    @Body() { newCategoryName }: { newCategoryName: string },
    @Res() res: Response
  ) {
    await this.menuService.addCategory(newCategoryName)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res.status(HttpStatus.CREATED).json(updatedMenu.categories)
  }

  @Delete('category')
  public async removeCategoey(
    @Body() { categoryToRemove }: { categoryToRemove: string },
    @Res() res: Response
  ) {
    await this.menuService.removeCategoey(categoryToRemove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res.status(HttpStatus.OK).json(updatedMenu.categories)
  }

  @Put('category/moveCategoryForward')
  public async moveCategoryForward(
    @Body() { categoryToMove }: { categoryToMove: string },
    @Res() res: Response
  ) {
    await this.menuService.moveCategoryForward(categoryToMove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res.status(HttpStatus.OK).json(updatedMenu.categories)
  }

  @Put('category/moveCategoryBack')
  public async moveCategoryBack(
    @Body() { categoryToMove }: { categoryToMove: string },
    @Res() res: Response
  ) {
    await this.menuService.moveCategoryBack(categoryToMove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res.status(HttpStatus.OK).json(updatedMenu.categories)
  }

  @Post('item')
  public async addItem(@Body() newItem: NewItemDto, @Res() res: Response) {
    await this.menuService.addItem(newItem)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res
      .status(HttpStatus.CREATED)
      .json(updatedMenu.items[newItem.category])
  }

  @Delete('item')
  public async removeItem(
    @Body() itemToRemove: ChangeItemDto,
    @Res() res: Response
  ) {
    await this.menuService.removeItem(itemToRemove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res
      .status(HttpStatus.OK)
      .json(updatedMenu.items[itemToRemove.category])
  }

  @Put('item/moveItemUp')
  public async moveItemUp(
    @Body() itemToMove: ChangeItemDto,
    @Res() res: Response
  ) {
    await this.menuService.moveItemUp(itemToMove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res
      .status(HttpStatus.OK)
      .json(updatedMenu.items[itemToMove.category])
  }

  @Put('item/moveItemDown')
  public async moveItemDown(
    @Body() itemToMove: ChangeItemDto,
    @Res() res: Response
  ) {
    await this.menuService.moveItemDown(itemToMove)
    const updatedMenu = await this.menuService.fetchMenuFromFile()
    return res
      .status(HttpStatus.OK)
      .json(updatedMenu.items[itemToMove.category])
  }
}
