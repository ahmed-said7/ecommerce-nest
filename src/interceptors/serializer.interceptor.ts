import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs';

export abstract class SerializerInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next
            .handle()
            .pipe(map( (value: {[key:string]: T | T[]}) => {
                return this.serialize(value);
            } ) );
    };
    abstract serialize( val : {[key:string]: T | T[] } ) : any; 
};

