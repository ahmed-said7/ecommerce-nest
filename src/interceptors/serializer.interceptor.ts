import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs';
import { Pagination } from 'src/utils/api.features';

export abstract class SerializerInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next
            .handle()
            .pipe(map( (value: {[key:string]:T}) => {
                return this.serialize(value);
            } ) );
    };
    abstract serialize( val : {[key:string]:T} ) : any; 
};


export abstract class GeTAllSerializerInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next
            .handle()
            .pipe(map( (value: { data : T[] , pagination : Pagination } ) => {
                
                if( value.data.length > 0 ){
                    const data=this.serialize(value.data);
                    return {pagination:value.pagination ,data};
                }else {
                    return {data:[]}
                }
            }))
    }
    abstract serialize( data : T[] ): any;
}
