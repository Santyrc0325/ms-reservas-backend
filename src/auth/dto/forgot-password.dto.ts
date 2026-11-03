import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico de la empresa',
    example: 'tu_correo@ejemplo.com'
  })
  @IsEmail({}, { message: 'Debe ingresar un correo válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;
}