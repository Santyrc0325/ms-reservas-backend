import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de seguridad recibido por correo' })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Nueva contraseña', minLength: 6 })
  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  newPassword: string;
}