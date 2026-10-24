import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty({ example: 1, description: 'ID de la empresa (Tenant) a la que pertenece' })
  @IsNumber({}, { message: 'El ID de la empresa debe ser numérico' })
  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio' })
  companyId: number;
}