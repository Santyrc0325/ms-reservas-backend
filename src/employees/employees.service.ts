import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { Employee } from './entities/employee.entity.js';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, companyId: number) {
    try {
      const employee = this.employeeRepository.create({
        ...createEmployeeDto,
        company: { id: companyId }, 
      });

      return await this.employeeRepository.save(employee);
    } catch (error) {
      throw new InternalServerErrorException('Error interno al registrar el empleado.');
    }
  }

  async findAll(companyId: number) {
    return await this.employeeRepository.find({
      where: { company: { id: companyId } },
    });
  }

  async findOne(id: number, companyId: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    
    if (!employee) {
      throw new NotFoundException(`El empleado #${id} no existe o no tienes permisos para acceder a él.`);
    }
    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto, companyId: number) {
    const employee = await this.findOne(id, companyId);
    await this.employeeRepository.update(employee.id, updateEmployeeDto);
    return this.findOne(id, companyId);
  }

  async remove(id: number, companyId: number) {
    const employee = await this.findOne(id, companyId);
    await this.employeeRepository.remove(employee);
    return { message: `Empleado #${id} eliminado correctamente.` };
  }
}