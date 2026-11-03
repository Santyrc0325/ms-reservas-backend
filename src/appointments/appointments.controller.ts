import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/enums/role.enum.js';


@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EMPLOYEE)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Request() req: any, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto, req.user.companyId);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    
    return this.appointmentsService.findAll(req.user, pageNumber, limitNumber);
  }

  @Get('schedule/:date')
  findByDate(@Request() req: any, @Param('date') date: string) {
    return this.appointmentsService.findByDate(date, req.user.companyId);
  }

  @Get('export/excel')
  async exportExcel(@Request() req: any, @Res() res: Response) {
    const buffer = await this.appointmentsService.exportExcel(req.user);
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=reporte_citas.xlsx',
    });
    
    res.send(buffer);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.appointmentsService.findOne(+id, req.user.companyId);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto, req.user.companyId);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.appointmentsService.remove(+id, req.user.companyId);
  }
}