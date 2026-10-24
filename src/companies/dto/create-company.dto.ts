import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Barbería Don Juan', description: 'Nombre comercial' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'barberia-don-juan', description: 'Identificador para la URL pública' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'admin@barberiadonjuan.com', description: 'Correo de acceso' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Mínimo 6 caracteres' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}