import { Injectable } from '@nestjs/common';
import {UserDoc} from "../user.entity"
import { GeTAllSerializerInterceptor, SerializerInterceptor } from 'src/interceptors/serializer.interceptor';


const fields=["passwordChangedAt","passwordResetCode"
                ,"passwordResetCodeExpires","passwordResetCodeVertified","password","__v","updatedAt"]

@Injectable()
export class UserSerializerInterceptor extends SerializerInterceptor<UserDoc>{
    serialize(val: {user: UserDoc}) {
        // @ts-ignore
        const obj={... val.user._doc };
        fields.forEach((field)=>{delete obj[field]});
        return {user:obj};
    };
};

@Injectable()
export class GeTAllUserSerializerInterceptor extends GeTAllSerializerInterceptor<UserDoc> {
    serialize(data: UserDoc[]) {
        return data.map( (value) =>{
            // @ts-ignore
            const obj={... value._doc };
            fields.forEach((field)=>{delete obj[field]});
            return obj;
        });
    };
}