import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto.js';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiPropertyOptional({ 
    example: 'CONFIRMED', 
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    description: 'Actualiza el estado de la cita' 
  })
  @IsString()
  @IsOptional()
  @IsIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], { 
    message: 'El estado solo puede ser PENDING, CONFIRMED, COMPLETED o CANCELLED' 
  })
  status?: string;
}