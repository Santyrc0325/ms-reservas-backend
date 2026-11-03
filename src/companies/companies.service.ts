import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { Company } from './entities/company.entity.js';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const hashedPassword = await bcrypt.hash(createCompanyDto.password, 10);

      const company = this.companyRepository.create({
        ...createCompanyDto,
        password: hashedPassword,
      });

      const savedCompany = await this.companyRepository.save(company);

      const { password, ...result } = savedCompany;
      return result;

    } catch (error) {
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El correo o el identificador de URL (slug) ya están en uso.');
      }
      throw new InternalServerErrorException('Error interno al crear la empresa.');
    }
  }

  async findByEmail(email: string) {
    return await this.companyRepository.findOne({ where: { email } });
  }

  findAll() { return `This action returns all companies`; }
  findOne(id: number) { return `This action returns a #${id} company`; }
  update(id: number, updateCompanyDto: UpdateCompanyDto) { return `This action updates a #${id} company`; }
  remove(id: number) { return `This action removes a #${id} company`; }

  async updateLogo(companyId: number, filename: string) {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (company.logo) {
      const oldImagePath = join(process.cwd(), 'uploads', 'logos', company.logo);
      try {
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.warn(`Aviso: No se pudo eliminar el logo anterior en ${oldImagePath}`);
      }
    }

    await this.companyRepository.update(companyId, { logo: filename });

    return { 
      message: 'Logo actualizado correctamente', 
      logoUrl: `/uploads/logos/${filename}` 
    };
  }
}