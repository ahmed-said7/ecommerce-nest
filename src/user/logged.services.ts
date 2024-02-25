import { Injectable, HttpException, UseInterceptors} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDoc} from "./user.entity";
import { Model} from "mongoose";
import * as bcrypt from "bcryptjs";
import { UserSerializerInterceptor } from "./interceptor/user.serialize.interceptor";
import { Models } from "src/enums/models.enum";


interface updateLoggedUser {
    name?: string;
    email?: string;
    role?: string;
    image?: string;
};

interface updateLoggedUserPassword {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
};

@Injectable()
@UseInterceptors(UserSerializerInterceptor)
export class LoggedUserServices {
    constructor(@InjectModel(Models.USER) private model:Model<UserDoc>){};
    getLoggedUser(user:UserDoc){
        return {user};
    };
    async updateLoggedUser({_id}:UserDoc,body:updateLoggedUser){
        let user=undefined;
        if(body.email){
            user=await this.model.findOne({email:body.email});
        };
        if(user){
            throw new HttpException('email is already in use',400);
        };
        user=await this.model.findByIdAndUpdate(_id,body,{new:true});
        return {user};
    };
    async deleteLoggedUser({_id}:UserDoc){
        let user=await this.model.findByIdAndUpdate(_id,{active:false},{new:true});
        return {user};
    };
    async updateLoggedUserPassword(user:UserDoc,body:updateLoggedUserPassword){
        if(body.password !== body.passwordConfirm){
            throw new HttpException('password mismatch',400);
        };
        const valid=await bcrypt.compare(body.oldPassword, user.password);
        if(! valid){
            throw new HttpException('password is not correct',400);
        }
        user.password = body.password;
        user.passwordChangedAt=new Date();
        await user.save();
        return {user};
    };
};