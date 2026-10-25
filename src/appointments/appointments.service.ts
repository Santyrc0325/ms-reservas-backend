import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';
import { Appointment } from './entities/appointment.entity.js';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, companyId: number) {
    const { customerId, employeeId, serviceId, date, time, ...appointmentData } = createAppointmentDto;

    const employeeConflict = await this.appointmentRepository.findOne({
      where: {
        date: date,
        time: time,
        employee: { id: employeeId },
        company: { id: companyId },
      },
    });

    if (employeeConflict && employeeConflict.status !== 'CANCELLED') {
      throw new ConflictException(`El empleado ya tiene una cita reservada para la fecha ${date} a las ${time}.`);
    }

    const customerConflict = await this.appointmentRepository.findOne({
      where: {
        date: date,
        time: time,
        customer: { id: customerId },
        company: { id: companyId },
      },
    });

    if (customerConflict && customerConflict.status !== 'CANCELLED') {
      throw new ConflictException(`El cliente ya tiene otra cita reservada para la fecha ${date} a las ${time}.`);
    }

    try {
      const newAppointment = this.appointmentRepository.create({
        ...appointmentData,
        date,
        time,
        company: { id: companyId },
        customer: { id: customerId },
        employee: { id: employeeId },
        service: { id: serviceId },
      });
      return await this.appointmentRepository.save(newAppointment);
    } catch (error) {
      console.error('ERROR EN TYPEORM (Appointments):', error);
      throw new InternalServerErrorException('Error interno al registrar la cita.');
    }
  }

  async findAll(companyId: number) {
    return await this.appointmentRepository.find({
      where: { company: { id: companyId } },
      relations: {
        customer: true,
        employee: true,
        service: true,
      },
    });
  }

  async findByDate(date: string, companyId: number) {
    return await this.appointmentRepository.find({
      where: { 
        date: date, 
        company: { id: companyId } 
      },
      relations: {
        customer: true,
        employee: true,
        service: true,
      },
      order: {
        time: 'ASC',
      },
    });
  }

  async findOne(id: number, companyId: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: {
        customer: true,
        employee: true,
        service: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`La cita #${id} no existe o no tienes permisos.`);
    }
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto, companyId: number) {
    const appointment = await this.findOne(id, companyId);
    
    const { customerId, employeeId, serviceId, date, time, ...updateData } = updateAppointmentDto;
    
    const targetDate = date || appointment.date;
    const targetTime = time || appointment.time;
    const targetEmployeeId = employeeId || appointment.employee.id;
    const targetCustomerId = customerId || appointment.customer.id;

    if (date || time || employeeId || customerId) {
      
      const employeeConflict = await this.appointmentRepository.findOne({
        where: {
          id: Not(id),
          date: targetDate,
          time: targetTime,
          employee: { id: targetEmployeeId },
          company: { id: companyId },
        },
      });

      if (employeeConflict && employeeConflict.status !== 'CANCELLED') {
        throw new ConflictException(`El empleado ya tiene una cita reservada para la fecha ${targetDate} a las ${targetTime}.`);
      }

      const customerConflict = await this.appointmentRepository.findOne({
        where: {
          id: Not(id),
          date: targetDate,
          time: targetTime,
          customer: { id: targetCustomerId },
          company: { id: companyId },
        },
      });

      if (customerConflict && customerConflict.status !== 'CANCELLED') {
        throw new ConflictException(`El cliente ya tiene otra cita reservada para la fecha ${targetDate} a las ${targetTime}.`);
      }
    }

    const dataToUpdate: any = { ...updateData };
    if (date) dataToUpdate.date = date;
    if (time) dataToUpdate.time = time;
    if (customerId) dataToUpdate.customer = { id: customerId };
    if (employeeId) dataToUpdate.employee = { id: employeeId };
    if (serviceId) dataToUpdate.service = { id: serviceId };

    await this.appointmentRepository.update(appointment.id, dataToUpdate);
    return this.findOne(id, companyId);
  }

  async remove(id: number, companyId: number) {
    const appointment = await this.findOne(id, companyId);
    await this.appointmentRepository.remove(appointment);
    return { message: `Cita #${id} eliminada correctamente.` };
  }
}