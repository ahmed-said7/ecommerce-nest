import { Injectable, HttpException, Param} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDoc, name } from "./user.entity";
import { Model, ObjectId, model } from "mongoose";
import { apiFactory } from "src/utils/api.factory";


interface updateUser {
    name?: string;
    email?: string;
    role?: string;
    image?: string;
};

class CreateUser{
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    image?: string;
    role?:string;
};


export interface queryInterface {
    [key:string] : string|object ;
    page?:string;
    sort?:string;
    select?:string;
    limit?:string;
    keyword?:string;
};

@Injectable()
export class UserServices {
    constructor(
        @InjectModel(name) private model:Model<UserDoc>,
        private factory:apiFactory<UserDoc>
    ){};
    getAllUsers(query:queryInterface){
        return this.factory.getAll(this.model,query);
    };
    async deleteUser(id:ObjectId){
        const {data:user}=await this.factory.deleteOne(this.model,id);
        return {user};
    }
    async geUser(id:ObjectId){
        const {data:user}=await this.factory.getOne(this.model,id);
        return {user}
    }
    async updateUser(id:ObjectId,body:updateUser){
        let user=undefined;
        if(body.email){
            user=await this.model.findOne({email:body.email});
        };
        if(user){
            throw new HttpException('email is already in use',400);
        };
        user=await this.model.findByIdAndUpdate(id,body,{new:true});
        return {user};
    };
    async createUser(body:CreateUser){
        let user=await this.model.findOne({email:body.email});
        if(user){
            throw new HttpException('user already exists',400);
        };
        if(body.password !== body.passwordConfirm ){
            throw new HttpException('password mismatch',400);
        };
        user=await this.model.create(body);
        if(! user ){
            throw new HttpException('can not create user',400);
        };
        return {user};
    };
};