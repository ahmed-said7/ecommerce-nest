import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { ProductServices } from "./product.service";
import { ProductController } from "./product.controller";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { ReviewModule } from "src/reviews/reviews.module";
import { Models } from "src/enums/models.enum";
import { categorySchema } from "src/category/category.entity";
import { userSchema } from "src/user/user.entity";
import { brandSchema } from "src/brand/brand.entity";
import { subcategorySchema } from "src/subcategory/subcategory.entity";


@Module({
    imports:[
        ReviewModule,
        SchemaDefinitionModule,
        MongooseModule.forFeatureAsync([
                {name:Models.CATEGOY,
                useFactory:function(){return categorySchema}
                ,inject:[SchemaDefinition]},

                {name:Models.USER,
                useFactory:function(){return userSchema}
                ,inject:[SchemaDefinition]},

                {name:Models.BRAND,
                useFactory:function(){return brandSchema}
                ,inject:[SchemaDefinition]},

                {name:Models.SUBCATEGORY,
                useFactory:function(){return subcategorySchema}
                ,inject:[SchemaDefinition]},

                {name:Models.PRODUCT,
                useFactory:function(schema:SchemaDefinition){return schema.product()},
                inject:[SchemaDefinition]},
            ])
            ,apiModule],
    providers:[ProductServices,{provide:"folder",useValue:"product"}],
    controllers:[ProductController]
})
export class ProductModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(ProductController);
    }
};