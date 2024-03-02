import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { catchExceptionsFilter } from 'src/filters/base.filter';
import * as session from 'express-session';
import * as passport from "passport";


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(session({
    saveUninitialized:true,resave:false,
    secret:'some secret',
    cookie:{maxAge:24*3600*60}
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  const {httpAdapter}=app.get(HttpAdapterHost);
  app.useGlobalFilters(new catchExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.useStaticAssets('src/uploads');
  await app.listen(5000);
};
bootstrap();
