import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public', 'uploads'), {
    prefix: '/uploads',
  });

  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  await app.listen(3000);
  console.log('🚀 Backend running on http://localhost:3000/graphql');
}
bootstrap();
