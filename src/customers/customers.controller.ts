import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Request() req: any, @Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto, req.user.companyId);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.customersService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.customersService.findOne(+id, req.user.companyId);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto, req.user.companyId);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.customersService.remove(+id, req.user.companyId);
  }
}