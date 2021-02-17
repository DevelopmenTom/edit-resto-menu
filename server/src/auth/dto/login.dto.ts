import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly password: string
}
