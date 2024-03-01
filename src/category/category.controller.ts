import { Body,Controller, Delete, Get, Param, Patch, Post,
        Query,UseGuards, UseInterceptors } from "@nestjs/common";

import { CategoryServices } from "./category.services";
import { queryInterface } from "src/user/admin-features/user.service";
import { ObjectId } from "mongoose";
import { UpdateCategoryDto } from "./dto/update.dto";
import { CreateCategoryDto } from "./dto/create.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";
import { FileInterceptorImage } from "src/interceptors/file.interceptor";
import { CreateSubcategoryDto } from "src/subcategory/dto/create.dto";

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
        @Body() body:UpdateCategoryDto){
        return this.categoryService.updateCat(id,body);
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
    createCat(@Body() body:CreateCategoryDto){
        return this.categoryService.createCat(body);
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
    createSub(@Query('id') category:ObjectId,@Body() body:CreateSubcategoryDto ){
        return this.categoryService.createSubcategory(body);
    };
};