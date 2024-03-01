import { ArgumentMetadata, ArgumentsHost, CallHandler, CanActivate, ExceptionFilter, ExecutionContext, HttpException, NestInterceptor, NestMiddleware, PipeTransform } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

export const Roles=Reflector.createDecorator< string[] >();
