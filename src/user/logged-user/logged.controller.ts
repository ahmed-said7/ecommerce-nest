import { Body, ClassSerializerInterceptor, Controller,Delete,Get,Patch, Req, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import { UpdateUserDto } from "../dto/update.user.dto";
import { LoggedUserServices } from "./logged.services";
import { User } from "src/decorator/user.decorator";
import { UserDoc } from "../user.entity";
import { changeLoggedUserPasswordDto } from "../dto/password.dto";
import { UserSerializerInterceptor } from "../interceptor/user.serialize.interceptor";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileValidationPipe } from "../validator/upload.pipe";
import { FileInterceptorImage } from "src/interceptors/file.interceptor";
import { Request } from "express";
import { AuthServices } from "../auth/auth.service";

@Controller('logged')

export class LoggedContoller {
    constructor(
        private loggedServices:LoggedUserServices,
        private authServices:AuthServices
        ){};
    
    @Get('')
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    getLoggedUser(@User() user : UserDoc ){
        console.log(user);
        return this.loggedServices.getLoggedUser(user);
    };

    @Patch('')
    
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptorImage)
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    updateLoggedUser(@User() user : UserDoc,@Body() body :UpdateUserDto ){
        return this.loggedServices.updateLoggedUser(user,body);
    };

    @Delete('')
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    updateDeleteUser(@User() user : UserDoc){
        return this.loggedServices.deleteLoggedUser(user);
    };

    @Patch('/password')
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    updateLoggedUserPassword(@Req() req:Request,@User() user : UserDoc,@Body() body :changeLoggedUserPasswordDto){
        return this.loggedServices.updateLoggedUserPassword(user,body,req);
    };

    @Get('vertify-email')
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    sendVertificationCode(@User() user : UserDoc){
        return this.authServices.createEmailVerificationCode(user.email);
    };
};