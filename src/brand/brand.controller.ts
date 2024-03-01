import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { queryInterface } from "src/user/admin-features/user.service";
import { ObjectId } from "mongoose";
import { CreateBrandDto } from "./dto/create.dto";
import { UpdateBrandDto } from "./dto/upate.dto";
import { BrandServices } from "./brand.services";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileValidationPipe } from "./pipes/file.pipe";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";
import { FileInterceptorImage } from "src/interceptors/file.interceptor";



@Controller('brand')
export class BrandController {
    constructor(private brandService: BrandServices){};
    @Get(":id")
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getBrand( @Param('id') id:ObjectId ){
        return this.brandService.getBrand(id);
    };

    @Get()
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getBrands(@Query() query : queryInterface ){
        return this.brandService.getAllBrands(query)
    };
    
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptorImage)
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    updateBrand(
        @Param('id') id:ObjectId,
        @Body() body:UpdateBrandDto,
        @UploadedFile(fileValidationPipe) image:string
        ){
        return this.brandService.updateBrand(id,{ ... body , image });
    };
    
    @Delete(":id")
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    deleteBrand(@Param('id') id:ObjectId){
        return this.brandService.deleteBrand(id);
    };

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptorImage)
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    createBrand(@Body() body:CreateBrandDto,@UploadedFile(fileValidationPipe) image:string){
        return this.brandService.createBrand({...body,image});
    };
};