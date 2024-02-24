import { Body, Controller, Delete, Get, Param, Patch,
        Post, Query,UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { queryInterface } from "src/utils/api.features";
import { FileFieldsInterceptor} from "@nestjs/platform-express";
import { CreateProduct, ProductServices, UpdateProduct } from "./product.service";
import { fileValidationPipe } from "./pipes/file.pipe";
import { bodyCreateProductValidationPipe, bodyUpdateProductValidationPipe} from "./pipes/body.pipe";
import { ProtectInterceptor } from "src/interceptors/protect.interceptor";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";



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
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    updateSub(
        @Param('id') id:ObjectId,
        @Body(bodyUpdateProductValidationPipe) body:UpdateProduct,
        @UploadedFiles(fileValidationPipe) uploaded : { images?:string[]; imageCover?:string; } ){
        return this.productService.updateProd(id,{...body,... uploaded });
    };

    @Delete(":id")
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    deleteSub(@Param('id') id:ObjectId){
        return this.productService.deleteProd(id);
    };

    @Post()
    @UseInterceptors(FileFieldsInterceptor([{name:"images",maxCount:7},{name:"imageCover",maxCount:1}]))
    @Roles(['admin','manager'])
    @UseGuards(AuthorizationGuard)
    createSub(
        @Body(bodyCreateProductValidationPipe) body:CreateProduct,
        @UploadedFiles(fileValidationPipe) uploaded : { images?:string[]; imageCover?:string; } ){
        return this.productService.createProd({ ... body , ... uploaded });
    };

};