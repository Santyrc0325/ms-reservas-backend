import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    try {
      const { customerId, employeeId, serviceId, ...appointmentData } = createAppointmentDto;
      
      const newAppointment = this.appointmentRepository.create({
        ...appointmentData,
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
    
    const { customerId, employeeId, serviceId, ...updateData } = updateAppointmentDto;
    const dataToUpdate: any = { ...updateData };
    
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