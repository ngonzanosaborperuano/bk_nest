import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  nombreCompleto!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  contrasena!: string;

  @IsOptional()
  foto?: string;
}
