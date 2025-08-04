import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: "ID único del usuario" })
  id!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "Juan Pérez",
    description: "Nombre completo del usuario",
  })
  nombre_completo!: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: "nigorora@gmail.com",
    description: "Email del usuario",
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "hashedPassword123",
    description: "Contraseña hasheada",
  })
  contrasena!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "https://example.com/foto.jpg",
    description: "URL de la foto del usuario",
    required: false,
  })
  foto?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: "2025-06-15 21:37:39",
    description: "Fecha de creación del usuario",
  })
  fecha_creacion!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Token de sesión JWT",
  })
  session_token?: string;
}
