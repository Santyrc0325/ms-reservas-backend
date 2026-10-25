import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Request() req: any, @Body() createServiceDto: CreateServiceDto) {
    const companyId = req.user.companyId;
    return this.servicesService.create(createServiceDto, companyId);
  }

  @Get()
  findAll(@Request() req: any) {
    const companyId = req.user.companyId;
    return this.servicesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.servicesService.findOne(+id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) { return this.servicesService.update(+id, updateServiceDto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.servicesService.remove(+id); }
}