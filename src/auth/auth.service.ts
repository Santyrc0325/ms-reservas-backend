import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CompaniesService } from '../companies/companies.service.js';
import { LoginDto } from './dto/login.dto.js';
import { MailService } from '../mail/mail.service.js';
import { Company } from '../companies/entities/company.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private companiesService: CompaniesService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const company = await this.companiesService.findByEmail(loginDto.email);
    
    if (!company) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, company.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: company.id, email: company.email };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const company = await this.companyRepository.findOne({ where: { email } });
    
    if (!company) {
      return { message: 'Si el correo existe en nuestro sistema, hemos enviado un enlace de recuperación.' };
    }

    const payload = { sub: company.id, email: company.email };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    await this.companyRepository.update(company.id, { resetPasswordToken: resetToken });

    await this.mailService.sendPasswordResetEmail(company.email, resetToken);

    return { message: 'Si el correo existe en nuestro sistema, hemos enviado un enlace de recuperación.' };
  }
}