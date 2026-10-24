import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@barberiadonjuan.com', description: 'Correo registrado de la empresa' })
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Contraseña de acceso' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}