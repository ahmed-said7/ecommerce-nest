import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { catchExceptionsFilter } from 'src/filters/base.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const {httpAdapter}=app.get(HttpAdapterHost);
  app.useGlobalFilters(new catchExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.useStaticAssets('src/uploads');
  await app.listen(5000);
};
bootstrap();
