import { Injectable } from '@nestjs/common';
import {UserDoc} from "../user.entity"
import {  SerializerInterceptor } from 'src/interceptors/serializer.interceptor';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Pagination } from 'src/utils/api.features';
import { ObjectId } from 'mongoose';

class UserEntity {
    @Transform(({value})=> value._id.toString() )
    _id:string;
    name:string;
    email:string;
    role:string;
    image:string;
    active:boolean;
    @Exclude()
    passwordResetCodeVertified?:boolean;
    @Exclude()
    passwordChangedAt:Date;
    @Exclude()
    passwordResetCode:string;
    @Exclude()
    passwordResetCodeExpires:Date;
    @Exclude()
    updatedAt:Date;
    @Exclude()
    createdAt:Date;
    @Exclude()
    __v:number;
    @Transform(({value})=>{return undefined})
    password:string;
    constructor(partial:Partial<UserEntity>){
        Object.assign(this, partial);
    };
};

@Injectable()
export class UserSerializerInterceptor extends SerializerInterceptor<UserDoc>{
    serialize(val: any ) {
        if( val.user ){
            const doc= new UserEntity(val.user._doc);
            return { ... val ,  user: doc };
        } else if ( val.data ){
            const docs=val.data.map(( doc )=> new UserEntity(doc._doc));
            return { ... val , data: docs };
        }else {
            return val;
        };
    };
};

