import { IsNotEmpty, IsString } from 'class-validator'

export class NewItemDto {
  @IsNotEmpty()
  @IsString()
  readonly category: string

  @IsNotEmpty()
  @IsString()
  readonly description: string

  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  readonly price: string
}
