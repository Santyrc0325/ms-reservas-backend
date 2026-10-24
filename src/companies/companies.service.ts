import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { Company } from './entities/company.entity.js';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      //Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(createCompanyDto.password, 10);

      //Remplazar la contraseña plana por la encriptada
      const company = this.companyRepository.create({
        ...createCompanyDto,
        password: hashedPassword,
      });

      //Guardar en MySQL
      const savedCompany = await this.companyRepository.save(company);

      // Retornar el objeto omitiendo la contraseña por seguridad
      const { password, ...result } = savedCompany;
      return result;

    } catch (error) {
      // Error para campos UNIQUE duplicados
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El correo o el identificador de URL (slug) ya están en uso.');
      }
      throw new InternalServerErrorException('Error interno al crear la empresa.');
    }
  }

  findAll() { return `This action returns all companies`; }
  findOne(id: number) { return `This action returns a #${id} company`; }
  update(id: number, updateCompanyDto: UpdateCompanyDto) { return `This action updates a #${id} company`; }
  remove(id: number) { return `This action removes a #${id} company`; }
}