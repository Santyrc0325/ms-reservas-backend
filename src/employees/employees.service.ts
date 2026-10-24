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

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      // Se agrupan los datos de acuerdo al CompanyId
      const { companyId, ...employeeData } = createEmployeeDto;

      //Se crea la instancia de acuerdo al company_id
      const employee = this.employeeRepository.create({
        ...employeeData,
        company: { id: companyId }, 
      });

      //Guardamos en MySQL
      return await this.employeeRepository.save(employee);

    } catch (error) {
      // Error de MySQL cuando falla una llave foránea
      if ((error as any).code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestException('La empresa especificada no existe en la base de datos.');
      }
      throw new InternalServerErrorException('Error interno al registrar el empleado.');
    }
  }

  findAll() { return `This action returns all employees`; }
  findOne(id: number) { return `This action returns a #${id} employee`; }
  update(id: number, updateEmployeeDto: UpdateEmployeeDto) { return `This action updates a #${id} employee`; }
  remove(id: number) { return `This action removes a #${id} employee`; }
}