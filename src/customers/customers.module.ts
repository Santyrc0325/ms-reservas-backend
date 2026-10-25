import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service.js';
import { CustomersController } from './customers.controller.js';
import { Customer } from './entities/customer.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    AuthModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}