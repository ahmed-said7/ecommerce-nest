import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { CreateSubcategoryDto } from "./dto/create.dto";
import { UpdateSubcategoryDto } from "./dto/update.dto";
import { SubcategoryServices } from "./subcategory.service";
import { queryInterface } from "src/utils/api.features";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileValidationPipe } from "./pipe/file.pipe";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";



@Controller('subcategory')
// @UseInterceptors(ProtectInterceptor)
export class SubcategoryController {

    constructor(private subcategoryService: SubcategoryServices){};

    @Get(":id")
    @Roles(['admin','manager','user'])
    @UseGuards(AuthorizationGuard)
    getSub( @Param('id') id:ObjectId ){
        return this.subcategoryService.getSub(id);
    };

    @Get()
    @Roles(['admin','manager','user'])
    @UseGuards(AuthorizationGuard)
    getSubs(@Query() query : queryInterface ){
        return this.subcategoryService.getAllSubs(query)
    };

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    updateSub(
        @Param('id') id:ObjectId,
        @Body() body:UpdateSubcategoryDto,
        @UploadedFile(fileValidationPipe) image?:string ){
        return this.subcategoryService.updateSub(id,{...body,image});
    };

    @Delete(":id")
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    deleteSub(@Param('id') id:ObjectId){
        return this.subcategoryService.deleteSub(id);
    };

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    createSub(@Body() body:CreateSubcategoryDto,@UploadedFile(fileValidationPipe) image?:string){
        return this.subcategoryService.createSub({...body,image});
    };

};