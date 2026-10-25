import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { Appointment } from '../appointments/entities/appointment.entity.js';
import { Customer } from '../customers/entities/customer.entity.js';
import { Employee } from '../employees/entities/employee.entity.js';
import { Service } from '../services/entities/service.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Customer, Employee, Service]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}