import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { googleGuard } from "./guard.google";

@Controller('google')
export class StrategyController {

    @Get()
    @UseGuards(googleGuard)
    googleAuth(){
        return { status:"success" };
    };

    @Get('redirect')
    @UseGuards(googleGuard)
    googleRedirect(@Req() req:any ){
        console.log(req.session,req.user);
        return { status : "success" }
    };

};