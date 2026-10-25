import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

 async findOne(id: number, companyId: number) {
    const service = await this.serviceRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    
    if (!service) {
      throw new NotFoundException(`El servicio #${id} no existe o no tienes permisos para acceder a él.`);
    }
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto, companyId: number) {
    const service = await this.findOne(id, companyId); // Reutilizamos findOne para validar existencia y propiedad
    await this.serviceRepository.update(service.id, updateServiceDto);
    return this.findOne(id, companyId); // Retornamos el objeto actualizado
  }

  async remove(id: number, companyId: number) {
    const service = await this.findOne(id, companyId);
    await this.serviceRepository.remove(service);
    return { message: `Servicio #${id} eliminado correctamente.` };
  }
}