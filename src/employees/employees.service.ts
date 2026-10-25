import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
  
  findOne(id: number) { return `This action returns a #${id} employee`; }
  update(id: number, updateEmployeeDto: UpdateEmployeeDto) { return `This action updates a #${id} employee`; }
  remove(id: number) { return `This action removes a #${id} employee`; }
}