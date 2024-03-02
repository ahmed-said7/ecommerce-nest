import { Body, ClassSerializerInterceptor, Controller,Param, Post, UploadedFile, UploadedFiles, UseInterceptors} from "@nestjs/common";
import { AuthServices } from "./auth.service";
import { CreateUserDto } from "../dto/create.user.dto";
import { LoginUserDto } from "../dto/login.user.dto";
import { changePasswordDto } from "../dto/password.dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { fileValidationPipe } from "../validator/upload.pipe";
import { FileInterceptorImage } from "src/interceptors/file.interceptor";
import { UserSerializerInterceptor } from "../interceptor/user.serialize.interceptor";


@Controller('auth')
// @UseInterceptors(ClassSerializerInterceptor)
// @UseInterceptors(UserSerializerInterceptor)
export class AuthContoller {
    constructor(private authServices:AuthServices){};
    @Post('signup')
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptorImage)
    signup(@Body() body : CreateUserDto){
        return this.authServices.signup(body);
    };

    @Post('login')
    login(@Body() body : LoginUserDto ){
        return this.authServices.login(body);
    };

    @Post('forget-password')
    forgetPassowrd(@Body('email') email:string){
        return this.authServices.forgetPassword(email);
    };

    @Post('change-password')
    changePassword(@Body() body:changePasswordDto ){
        return this.authServices.changePassword(body);
    };

    @Post(':code')
    getOne(@Param('code') code:string){
        return this.authServices.vertifyResetCode(code);
    };
};