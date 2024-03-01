import { Body,Controller, Delete, Get, Param, Patch, Post,
        Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";

import { CategoryServices } from "./category.services";
import { queryInterface } from "src/user/admin-features/user.service";
import { ObjectId } from "mongoose";
import { UpdateCategoryDto } from "./dto/update.dto";
import { CreateCategoryDto } from "./dto/create.dto";
import { fileValidationPipe } from "./pipe/file.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";
import { fileValidationPipe as subValidationPipe } from "src/subcategory/pipe/file.pipe";
import { FileInterceptorImage } from "src/interceptors/file.interceptor";

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
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptorImage)
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
    @UseInterceptors(FileInterceptorImage)
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    createCat(@Body() body:CreateCategoryDto,
        @UploadedFile(fileValidationPipe) image?:string){
        return this.categoryService.createCat({...body,image});
    };

    @Get(':id/subcategory')
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getSubs(@Query() query:queryInterface,@Param('id') id:ObjectId ){
        return this.categoryService.getAllSubcategories(id,query);
    };

    @Post(':id/subcategory')
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptorImage)
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    createSub(@Query('id') category:ObjectId,@Body('name') name:string, 
        @UploadedFile(subValidationPipe) image?:string ){
        return this.categoryService.createSubcategory({category,name,image});
    };
};