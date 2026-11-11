import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { 
      logger: [
        'log', 
        'warn', 
        'error', 
      ] 
    }
  );
  const apiPort = process.env.API_PORT || 8080;

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
      'qh-user-id',
    ],
    credentials: true,
    origin: true,
  });

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const baseUrls = [
    {
      url: process.env.BASE_URL || `http://localhost:${apiPort}`,
      description: 'Local server',
    },
    { 
      url: 'https://prod.example.com', 
      description: 'Production' 
    },
  ];

  await app.listen(apiPort, async () => {
    const logger = new Logger();
    logger.log(`\n ############################## API TITHES PANEL ##############################`);
    logger.log(`Servidor iniciado em ${baseUrls[0].url}`);
    logger.log(`Port: ${apiPort}`);
    logger.log(`\n ############################## API TITHES PANEL ##############################`);
  });
}
bootstrap();