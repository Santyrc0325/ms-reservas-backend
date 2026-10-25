import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity.js';
import { Customer } from '../customers/entities/customer.entity.js';
import { Employee } from '../employees/entities/employee.entity.js';
import { Service } from '../services/entities/service.entity.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment) private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}

  async getSummary(companyId: number, dateQuery?: string) {
    const today = dateQuery || new Date(new Date().getTime() - 5 * 3600 * 1000).toISOString().split('T')[0];

    const [totalCustomers, totalEmployees, totalServices, todayAppointments] = await Promise.all([
      this.customerRepo.count({ where: { company: { id: companyId } } }),
      this.employeeRepo.count({ where: { company: { id: companyId } } }),
      this.serviceRepo.count({ where: { company: { id: companyId } } }),
      this.appointmentRepo.find({ 
        where: { date: today, company: { id: companyId } },
        relations: { customer: true, employee: true, service: true },
        order: { time: 'ASC' },
      }),
    ]);

    return {
      metrics: {
        totalCustomers,
        totalEmployees,
        totalServices,
        todayAppointmentsCount: todayAppointments.length,
      },
      todayAppointments,
    };
  }
}