import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { Request } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?:{
                _id:ObjectId;
                name:string;
                email:string;
                role:string;
            };
        }
    }
}
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request;
        return request.user;
    },
);