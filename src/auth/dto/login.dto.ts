import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: "Please enter correct email" })
  @ApiProperty({ example: "nigorora@gmail.com" })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: "gdikoYtw8jT6JJzBAONXauxYql82" })
  contrasena!: string;
}
