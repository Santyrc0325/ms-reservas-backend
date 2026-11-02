import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EmployeesService } from './employees.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Request() req: any, @Body() createEmployeeDto: CreateEmployeeDto) {
    const companyId = req.user.companyId; 
    return this.employeesService.create(createEmployeeDto, companyId);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, description: 'Número de página (por defecto 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de registros por página (por defecto 10)' })
  @ApiQuery({ name: 'search', required: false, description: 'Término de búsqueda' })
  findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.employeesService.findAll(req.user.companyId, pageNumber, limitNumber, search);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.employeesService.findOne(+id, req.user.companyId);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto, req.user.companyId);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.employeesService.remove(+id, req.user.companyId);
  }
}