import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { MailService } from '../mail/mail.service.js';
import { Company } from '../companies/entities/company.entity.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { Role } from './enums/role.enum.js';
import { Employee } from '../employees/entities/employee.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const company = await this.companyRepository.findOne({ 
          where: { email: loginDto.email } 
        });
        
    if (!company) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, company.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: company.id, 
      email: company.email, 
      role: Role.ADMIN
    };
    
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

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const company = await this.companyRepository.findOne({ where: { id: payload.sub } });

      if (!company || company.resetPasswordToken !== token) {
        throw new BadRequestException('Token inválido o ya utilizado');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await this.companyRepository.update(company.id, {
        password: hashedPassword,
        resetPasswordToken: null,
      });

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new UnauthorizedException('El enlace es inválido o ha expirado');
    }
  }

  async employeeLogin(loginDto: LoginDto) {
    const employee = await this.employeeRepository.findOne({
      where: { email: loginDto.email },
      relations: { company: true },
    });

    if (!employee || !employee.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, employee.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: employee.id,
      email: employee.email,
      role: Role.EMPLOYEE,
      companyId: employee.company.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}