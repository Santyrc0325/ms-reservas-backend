import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { Service } from './entities/service.entity.js';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, companyId: number) {
    try {
      const newService = this.serviceRepository.create({
        ...createServiceDto,
        company: { id: companyId },
      });
      return await this.serviceRepository.save(newService);
    } catch (error) {
      console.error('ERROR REAL EN TYPEORM:', error);
      throw new InternalServerErrorException('Error interno al registrar el servicio.');
    }
  }

  async findAll(companyId: number) {
    return await this.serviceRepository.find({
      where: { company: { id: companyId } },
    });
  }
  
  findOne(id: number) { return `This action returns a #${id} service`; }
  update(id: number, updateServiceDto: UpdateServiceDto) { return `This action updates a #${id} service`; }
  remove(id: number) { return `This action removes a #${id} service`; }
}