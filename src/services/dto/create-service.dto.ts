import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Corte Clásico', description: 'Nombre del servicio' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
  name: string;

  @ApiPropertyOptional({ example: 'Corte con tijera, lavado y peinado', description: 'Descripción detallada' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25000, description: 'Precio del servicio' })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @ApiProperty({ example: 30, description: 'Duración en minutos' })
  @IsNumber()
  @Min(1, { message: 'La duración debe ser mayor a 0 minutos' })
  duration: number;
}