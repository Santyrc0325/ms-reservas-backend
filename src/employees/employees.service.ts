import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { Employee } from './entities/employee.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, companyId: number) {
    const { password, ...restOfData } = createEmployeeDto;
    
    const newEmployee = this.employeeRepository.create({
      ...restOfData,
      company: { id: companyId },
    });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      newEmployee.password = await bcrypt.hash(password, salt);
    }

    return await this.employeeRepository.save(newEmployee);
  }

  async findAll(companyId: number, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? [
          { company: { id: companyId }, name: Like(`%${search}%`) },
          { company: { id: companyId }, email: Like(`%${search}%`) },
        ]
      : { company: { id: companyId } };

    const [data, total] = await this.employeeRepository.findAndCount({
      where: whereCondition,
      take: limit,
      skip: skip,
      order: { id: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit) || 1,
      },
    };
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