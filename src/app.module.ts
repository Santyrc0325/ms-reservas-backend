import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from './companies/companies.module.js';
import { EmployeesModule } from './employees/employees.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    // CARGAR VARIABLES DE ENTORNO DE FORMA GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // CONEXION A LA BD
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false, //FALSE PORQUE YA ESTA ESTRUCTURADA EN DBeaver
      }),
    }),
    CompaniesModule,
    EmployeesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}