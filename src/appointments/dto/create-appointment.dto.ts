import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: '2026-10-30', description: 'Fecha de la reserva (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '14:30', description: 'Hora de la reserva (HH:mm)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora debe estar en formato HH:mm' })
  @IsNotEmpty()
  time: string;

  @ApiPropertyOptional({ example: 'Cliente solicitó ser atendido por Carlos', description: 'Notas adicionales' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 1, description: 'ID del cliente que reserva' })
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty({ example: 1, description: 'ID del empleado que atenderá' })
  @IsNumber()
  @IsNotEmpty()
  employeeId: number;

  @ApiProperty({ example: 1, description: 'ID del servicio agendado' })
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;
}