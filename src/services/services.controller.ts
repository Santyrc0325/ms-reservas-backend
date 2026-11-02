import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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
  @ApiQuery({ name: 'page', required: false, description: 'Número de página (por defecto 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de registros por página (por defecto 10)' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre del servicio' })
  findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.servicesService.findAll(req.user.companyId, pageNumber, limitNumber, search);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) { 
    return this.servicesService.findOne(+id, req.user.companyId); 
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) { 
    return this.servicesService.update(+id, updateServiceDto, req.user.companyId); 
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) { 
    return this.servicesService.remove(+id, req.user.companyId); 
  }
}