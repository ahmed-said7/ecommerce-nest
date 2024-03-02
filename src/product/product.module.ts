import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { ProductServices } from "./product.service";
import { ProductController } from "./product.controller";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { ReviewModule } from "src/reviews/reviews.module";
import { Models } from "src/enums/models.enum";
import { InitializedCategorySchema, InitializedCategorySchemaModule } from "src/category/category.entity";
import { InitializedUserSchema, InitializedUserSchemaModule } from "src/user/user.entity";
import { InitializedBrandSchema, InitializedBrandSchemaModule } from "src/brand/brand.entity";
import { InitializedSubcategorySchema, InitializedSubcategorySchemaModule } from "src/subcategory/subcategory.entity";
import { InitializeProductSchema, InitializedProductSchemaModule } from "./product.entity";


@Module({
    imports:[
        InitializedProductSchemaModule,
        InitializedSubcategorySchemaModule,
        InitializedBrandSchemaModule,
        InitializedUserSchemaModule,
        InitializedCategorySchemaModule,
        ReviewModule,
        MongooseModule.forFeatureAsync([
                {
                    name:Models.CATEGOY,
                    useFactory:
                    function(schema:InitializedCategorySchema){
                        return schema.category
                    }
                    ,inject:[InitializedCategorySchema]
                },
                {
                    name:Models.USER,
                    useFactory:function(schema:InitializedUserSchema){
                        return schema.user
                    },inject:[InitializedUserSchema]
                },
                {
                    name:Models.BRAND,
                    useFactory:function(schema:InitializedBrandSchema){
                        return schema.brand;
                    }
                    ,inject:[InitializedBrandSchema]
                },
                {
                    name:Models.SUBCATEGORY,
                    useFactory:function(schema:InitializedSubcategorySchema){
                    return schema.subcategory; }
                    ,inject:[InitializedSubcategorySchema]
                },
                {
                    name:Models.PRODUCT,
                    useFactory
                    :function(schema:InitializeProductSchema){return schema.product},
                    inject:[InitializeProductSchema]
                },
            ])
            ,apiModule],
    providers:[
        ProductServices,{provide:"folder",useValue:"product"}
    ],
    controllers:[ProductController]
})
export class ProductModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(ProductController);
    }
};