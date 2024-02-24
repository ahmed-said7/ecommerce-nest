import { Body, Controller,Delete,Get,Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import { AuthServices } from "./auth.service";
import { CreateUserDto } from "./dto/create.user.dto";
import { LoginUserDto } from "./dto/login.user.dto";

import { changePasswordDto } from "./dto/password.dto";
import { UserServices, queryInterface } from "./user.service";
import { ObjectId } from "mongoose";
import { UpdateUserDto } from "./dto/update.user.dto";
import { GeTAllUserSerializerInterceptor, UserSerializerInterceptor } from "./interceptor/user.serialize.interceptor";
import { ProtectInterceptor } from "src/interceptors/protect.interceptor";
import { AuthorizationGuard } from "src/guards/user.guard";
import { Roles } from "src/decorator/roles.decorator";
import { fileValidationPipe } from "./validator/upload.pipe";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('user')

// @UseInterceptors(UserSerializerInterceptor)
// @UseInterceptors(ProtectInterceptor)
export class UserContoller {
    constructor(private userServices:UserServices){};
    
    @Post()
    @UseInterceptors(UserSerializerInterceptor)
    @UseInterceptors(FileInterceptor('image'))
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    createUser(@Body() body : CreateUserDto , @UploadedFile(fileValidationPipe) image?:string ){
        return this.userServices.createUser({...body,image});
    };

    @Get(':id')
    @UseInterceptors(UserSerializerInterceptor)
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    getUser(@Param('id') id : ObjectId ){
        return this.userServices.geUser(id);
    };

    @Get('')
    // @UseGuards(new AuthorizationGuard(["admin","user"]))
    @UseInterceptors(GeTAllUserSerializerInterceptor)
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    getAll(@Query() query:queryInterface){
        return this.userServices.getAllUsers(query);
    };

    @Patch(':id')
    @UseInterceptors(UserSerializerInterceptor)
    @UseInterceptors(FileInterceptor('image'))
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    uptdateUser(@Param('id') id : ObjectId,@Body() body:UpdateUserDto
        ,@UploadedFile(fileValidationPipe) image?:string ){
        return this.userServices.updateUser(id,{...body,image});
    };

    @Delete(':id')
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    @UseInterceptors(UserSerializerInterceptor)
    deleteUser(@Param('id') id : ObjectId ){
        return this.userServices.deleteUser(id);
    };
};
