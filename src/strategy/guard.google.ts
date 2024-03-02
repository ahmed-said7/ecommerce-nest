import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";



export class googleGuard extends AuthGuard('google') {
    async canActivate(context: ExecutionContext) {
        const activate=await super.canActivate(context) as boolean;
        const req=context.switchToHttp().getRequest<Request>();
        await super.logIn(req);
        return activate;
    }
};