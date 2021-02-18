import { IsNotEmpty, IsString } from 'class-validator'

export class ChangeItemDto {
  @IsNotEmpty()
  @IsString()
  readonly category: string

  @IsNotEmpty()
  @IsString()
  readonly name: string
}
