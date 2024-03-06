import { Injectable, HttpException, Param, ConfigurableModuleBuilder} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDoc } from "../user.entity";
import { Model, ObjectId } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { NodemailerServices } from "src/nodemailer/nodemailer.services";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { Models } from "src/enums/models.enum";


class CreateUser{
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    image?: string;
    role?:string;
};
class LoginUser{
    email: string;
    password: string;
};





@Injectable()
export class AuthServices {
    
    constructor
    ( 
        @InjectModel(Models.USER) private model: Model<UserDoc> ,
        private nodemailerService:NodemailerServices,
        private config:ConfigService
    ){};
    
    async signup(body:CreateUser){
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
        await this.emailVerification(user);
        const token=this.createToken(user._id);
        return {token};
    };
    
    async login(body:LoginUser){
        let user=await this.model.findOne({email:body.email});
        if( ! user ){
            throw new HttpException('user not exists',400);
        };
        const valid=await bcrypt.compare(body.password,user.password);
        if( ! valid ){
            throw new HttpException('user email or password not correct',400);
        };
        if(user.active === false){
            user.active = true;
            await user.save();
        };
        const token=this.createToken(user._id);
        return { token };
    };

    async createEmailVerificationCode( email:string ){
        const user=await this.model.findOne({email});
        if( ! user ){
            throw new HttpException('user not exists',400);
        };
        await this.emailVerification(user);
        return {status:"code sent"};
    };

    async vertifyEmail(code:string){
        const hash=this.createHash(code);
        const user=await this.model.findOne({
            emailVerifiedCode:hash,emailVerifiedExpired:{$gt:Date.now()}
        });
        if(!user){
            throw new HttpException('email Verified Code expired',400);
        };
        user.emailVerifiedCode=undefined;
        user.emailVerifiedExpired=undefined;
        user.emailVertified=true;
        await user.save();
        return {status:"vertified"};
    };

    async forgetPassword(email:string){
        let user=await this.model.findOne({ email });
        if(! user ){
            throw new HttpException('user not found',400);
        };
        const resetCode=this.nodemailerService.resetCode();
        user.passwordResetCode=this.createHash(resetCode);
        user.passwordResetCodeExpires=new Date( Date.now() + 4*60*1000 );
        await user.save();
        try{
            await this.nodemailerService
                .sendChangeingPasswordCode({email:user.email,resetCode});
        }catch(e){
            console.log(e);
            user.passwordResetCode=undefined;
            user.passwordResetCodeExpires=undefined;
            await user.save();
            throw new HttpException('internal server error',400);
        };
        return {resetCode}
    };
    
    async vertifyResetCode(resetCode:string){
        const hash=this.createHash(resetCode);
        let user=await this.model
            .findOne
            ({ passwordResetCode:hash , passwordResetCodeExpires:{ $gt: Date.now() } });
        if(! user ){
            throw new HttpException('user not found',400);
        };
        user.passwordResetCode=undefined;
        user.passwordResetCodeExpires=undefined;
        user.passwordResetCodeVertified=true;
        await user.save();
        return {status:'vertified'}
    };
    
    async changePassword(body:{email:string; password:string; passwordConfirm:string;}){
        let user=await this.model
            .findOne({ email:body.email });
        if(! user  ){
            throw new HttpException('user not found',400);
        };
        if(! user.passwordResetCodeVertified ){
            throw new HttpException('resetcode is not vertified',400);
        };
        if(body.password !== body.passwordConfirm){
            throw new HttpException('password mismatch',400);
        };
        user.password = body.password;
        user.passwordChangedAt=new Date();
        await user.save();
        return {user};
    }
    private async emailVerification(user:UserDoc){
        const code=this.nodemailerService.resetCode();
        console.log(code);
        user.emailVerifiedCode=this.createHash(code);
        user.emailVerifiedExpired=new Date( Date.now() + 5 * 60 * 1000 );
        try{
            await this.nodemailerService.sendWelcome({email:user.email,resetCode:code});
        }catch(err){
            user.emailVerifiedCode=undefined;
            user.emailVerifiedExpired=undefined;
            await user.save();
            throw err;
        };
        await user.save();
    };

    private createToken(userId:ObjectId){
        const token = jwt.sign({userId},this.config.get<string>('jwt_secret'),{expiresIn:"30d"});
        return token;
    };
    
    private createHash(code:string){
        return crypto.createHash('sha256').update(code).digest('hex');
    }

};