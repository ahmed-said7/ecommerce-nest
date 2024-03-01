import { Body, Controller, Delete, Get, Param, Patch,
        Post, Query,UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { queryInterface } from "src/utils/api.features";
import { FileFieldsInterceptor} from "@nestjs/platform-express";
import { CreateProduct, ProductServices, UpdateProduct } from "./product.service";
import { fileValidationPipe } from "./pipes/file.pipe";
import { bodyCreateProductValidationPipe, bodyUpdateProductValidationPipe} from "./pipes/body.pipe";

import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";
import { User } from "src/decorator/user.decorator";
import { UserDoc } from "src/user/user.entity";
import { FileInterceptorProductImage } from "src/interceptors/file.product.interceptor";
import { CreateProductDto } from "./dto/create.dto";
import { UpdateProductDto } from "./dto/update.dto";



@Controller('product')
// @UseInterceptors(ProtectInterceptor)
export class ProductController {

    constructor(private productService: ProductServices){};

    @Get(":id")
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    getProd( @Param('id') id:ObjectId ){
        return this.productService.getProd(id);
    };

    @Get()
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    getProds(@Query() query : queryInterface ){
        return this.productService.getAllProds(query)
    };

    @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([{name:"images",maxCount:7},{name:"imageCover",maxCount:1}]))
    @UseInterceptors(FileInterceptorProductImage)
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    updateSub(
        @Param('id') id:ObjectId,
        @Body() body:UpdateProductDto ){
        return this.productService.updateProd(id,body);
    };

    @Delete(":id")
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    deleteSub(@Param('id') id:ObjectId){
        return this.productService.deleteProd(id);
    };

    @Post()
    @UseInterceptors(FileFieldsInterceptor([{name:"images",maxCount:7},{name:"imageCover",maxCount:1}]))
    @UseInterceptors(FileInterceptorProductImage)
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    createProd(
        @Body() body:CreateProductDto){
        return this.productService.createProd(body);
    };

    @Delete(":id/review")
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    createReview(
        @Param('id') id:ObjectId,
        @User() user:UserDoc,
        @Body('rating') rating:number,
        @Body('review') review?: string
        ){
        return this.productService.createReview(user,id,rating,review);
    };

    @Get(":id/review")
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    getReviews(@Param('id') id:ObjectId,@Query() query:queryInterface){
        return this.productService.getProductReviews(id,query);
    };

};