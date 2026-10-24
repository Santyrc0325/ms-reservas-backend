import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CompaniesService } from '../companies/companies.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private companiesService: CompaniesService,
    private jwtService: JwtService,
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
}