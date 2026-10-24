import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport'; // <-- Importación directa añadida
import { EmployeesService } from './employees.service.js';
import { EmployeesController } from './employees.controller.js';
import { Employee } from './entities/employee.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    AuthModule,
    PassportModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}