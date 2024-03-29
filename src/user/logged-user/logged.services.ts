import { Injectable, HttpException, UseInterceptors} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDoc} from "../user.entity";
import { Model} from "mongoose";
import * as bcrypt from "bcryptjs";
import { Models } from "src/enums/models.enum";
import { Request } from "express";


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
    async updateLoggedUserPassword(user:UserDoc,body:updateLoggedUserPassword,req:Request){
        if(body.password !== body.passwordConfirm){
            throw new HttpException('password mismatch',400);
        };
        const valid=await bcrypt.compare(body.oldPassword, user.password);
        if(! valid){
            throw new HttpException('password is not correct',400);
        }
        req.session=null;
        user.password = body.password;
        user.passwordChangedAt=new Date();
        await user.save();
        return {user};
    };
};