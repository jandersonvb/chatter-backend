import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalPipes(new ValidationPipe()); // Middleware to validate requests
  app.useLogger(app.get(Logger)) // Middleware to log requests
  app.use(cookieParser()); // Middleware to parse cookies

  const configService = app.get(ConfigService)

  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
