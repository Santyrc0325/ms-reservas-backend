import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiQuery({ name: 'date', required: false, description: 'Fecha opcional (YYYY-MM-DD)' })
  getSummary(@Request() req: any, @Query('date') date?: string) {
    return this.dashboardService.getSummary(req.user.companyId, date);
  }
}