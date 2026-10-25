import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { Customer } from './entities/customer.entity.js';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, companyId: number) {
    try {
      const newCustomer = this.customerRepository.create({
        ...createCustomerDto,
        company: { id: companyId },
      });
      return await this.customerRepository.save(newCustomer);
    } catch (error) {
      console.error('ERROR EN TYPEORM:', error);
      throw new InternalServerErrorException('Error interno al registrar el cliente.');
    }
  }

  async findAll(companyId: number) {
    return await this.customerRepository.find({
      where: { company: { id: companyId } },
    });
  }

  async findOne(id: number, companyId: number) {
    const customer = await this.customerRepository.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!customer) {
      throw new NotFoundException(`El cliente #${id} no existe o no tienes permisos para acceder a él.`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto, companyId: number) {
    const customer = await this.findOne(id, companyId);
    await this.customerRepository.update(customer.id, updateCustomerDto);
    return this.findOne(id, companyId);
  }

  async remove(id: number, companyId: number) {
    const customer = await this.findOne(id, companyId);
    await this.customerRepository.remove(customer);
    return { message: `Cliente #${id} eliminado correctamente.` };
  }
}