import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CategoryServices } from "./category.services";
import { queryInterface } from "src/user/user.service";
import { ObjectId } from "mongoose";
import { UpdateCategoryDto } from "./dto/update.dto";
import { CreateCategoryDto } from "./dto/create.dto";
import { fileValidationPipe } from "./pipe/file.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProtectInterceptor } from "src/interceptors/protect.interceptor";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";


@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryServices){};
    @Get(":id")
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getCat( @Param('id') id:ObjectId ){
        return this.categoryService.getCat(id);
    };

    @Get()
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getCats(@Query() query : queryInterface ){
        return this.categoryService.getAllCats(query)
    };
    
    @Patch(':id')
    @UseGuards(AuthorizationGuard)
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    updateCat(
        @Param('id') id:ObjectId,
        @Body() body:UpdateCategoryDto,
        @UploadedFile(fileValidationPipe) image?:string
        ){
        return this.categoryService.updateCat(id,{...body,image});
    };
    
    @Delete(":id")
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    deleteCat(@Param('id') id:ObjectId){
        return this.categoryService.deleteCat(id);
    };

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    createCat(@Body() body:CreateCategoryDto,
        @UploadedFile(fileValidationPipe) image?:string){
        return this.categoryService.createCat({...body,image});
    };
};