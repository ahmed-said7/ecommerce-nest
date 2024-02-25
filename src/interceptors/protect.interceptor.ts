// import 
// { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } 
// from '@nestjs/common';
// import * as jwt from "jsonwebtoken";

// interface Payload extends jwt.JwtPayload {
//     userId?: ObjectId;
// }

// import {Request} from "express"
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, ObjectId } from 'mongoose';
// import { name,UserDoc } from '../user/user.entity';

// declare global {
//     namespace Express {
//         interface Request {
//             user?:{
//                 _id:ObjectId;
//                 name:string;
//                 email:string;
//                 role:string;
//             };
//         }
//     }
// }

// @Injectable()
// export class ProtectInterceptor implements NestInterceptor {
//     constructor(@InjectModel(name) private model:Model<UserDoc>){};
//     async intercept(context: ExecutionContext, next: CallHandler){
//     const req:Request=context.switchToHttp().getRequest();
//     let token:string;
//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
//         token=req.headers.authorization.split(' ')[1];
//     };
//     if( !token ){
//         throw new HttpException('user not authenticated , provide token',400);
//     };

//     const payload=jwt?.verify(token,'asaeed79') as Payload;
//     const user=await this.model.findById(payload.userId);
//     if(!user){
//         throw new HttpException('User not found',400);
//     };

//     if(user.passwordChangedAt){
//         const stamps=new Date(user.passwordChangedAt).getTime() / 1000;
//         if(stamps > payload.iat){
//             throw new HttpException('user password changed , login again',400);
//         };
//     };

//     if(user.active === false){
//         throw new HttpException('User is not active login',400);
//     }

//     req.user=user;
//     req.user.role=user.role;
//     console.log(req.user);
//     return next
//         .handle()
//         .pipe();
//     }
// }