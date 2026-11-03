import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Carlos Mendoza', description: 'Nombre completo del profesional' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del empleado es obligatorio' })
  name: string;

  @ApiPropertyOptional({ example: '+573001234567', description: 'Teléfono de contacto (Opcional)' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Contraseña123', description: 'Contraseña para acceso al sistema', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}