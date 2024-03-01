import { Body, ClassSerializerInterceptor, Controller,Delete,Get,Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import { CreateUserDto } from "../dto/create.user.dto";
import { UserServices, queryInterface } from "./user.service";
import { ObjectId } from "mongoose";
import { UpdateUserDto } from "../dto/update.user.dto";
import { AuthorizationGuard } from "src/guards/user.guard";
import { Roles } from "src/decorator/roles.decorator";
import { fileValidationPipe } from "../validator/upload.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileInterceptorImage } from "src/interceptors/file.interceptor";
import { UserSerializerInterceptor } from "../interceptor/user.serialize.interceptor";


@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(UserSerializerInterceptor)
export class UserContoller {
    constructor(private userServices:UserServices){};
    
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptorImage)
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    createUser(@Body() body : CreateUserDto ){
        return this.userServices.createUser(body);
    };

    @Get(':id')
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    getUser(@Param('id') id : ObjectId ){
        return this.userServices.geUser(id);
    };

    @Get('')
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    getAll(@Query() query:queryInterface){
        return this.userServices.getAllUsers(query);
    };

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptorImage)
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    uptdateUser(@Param('id') id : ObjectId,@Body() body:UpdateUserDto ){
        return this.userServices.updateUser(id,body);
    };

    @Delete(':id')
    @Roles(["admin","user"])
    @UseGuards(AuthorizationGuard)
    deleteUser(@Param('id') id : ObjectId ){
        return this.userServices.deleteUser(id);
    };
};
