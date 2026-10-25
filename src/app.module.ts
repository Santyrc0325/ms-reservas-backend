import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from './companies/companies.module.js';
import { EmployeesModule } from './employees/employees.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ServicesModule } from './services/services.module.js';
import { CustomersModule } from './customers/customers.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // CONEXION A LA BD
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, TypeOrmModule, CompaniesModule, EmployeesModule, AuthModule, ServicesModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CompaniesModule,
    EmployeesModule,
    AuthModule,
    ServicesModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}