import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'María Camila Gómez', description: 'Nombre completo del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  name: string;

  @ApiPropertyOptional({ example: 'maria@ejemplo.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+573001112233', description: 'Teléfono de contacto' })
  @IsString()
  @IsOptional()
  phone?: string;
}