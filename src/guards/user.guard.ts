import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorator/roles.decorator';
import { Request } from 'express';
import { ObjectId } from 'mongoose';

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

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get(Roles, context.getHandler());
        console.log(roles);
        if (!roles) {
            return false;
        }
        const request=context.switchToHttp().getRequest() as Request;
        console.log(request.user);
        return roles.includes(request.user.role);
    };
};