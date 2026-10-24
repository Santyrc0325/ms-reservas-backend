import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // VALIDACION GLOBAL
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina datos basura que el cliente envie
    forbidNonWhitelisted: true, // Rechaza la peticion si trae datos no definidos en el DTO
    transform: true, // Transforma los JSON a clases TypeScript
  }));

  const config = new DocumentBuilder()
    .setTitle('API de Reservas Multi-tenant')
    .setDescription('Endpoints para el Micro-SaaS de agendamiento')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();