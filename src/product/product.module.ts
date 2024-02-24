import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";

import { name as prodName, productSchema} from "./product.entity";
import { name as catName , categorySchema } from "src/category/category.entity";
import { name as subName,subcategorySchema } from "src/subcategory/subcategory.entity";
import { name as brandName,brandSchema } from "src/brand/brand.entity";
import { ProductServices } from "./product.service";
import { ProductController } from "./product.controller";
import { name as userName ,userSchema } from "src/user/user.entity";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";


@Module({
    imports:[
        SchemaDefinitionModule,
        MongooseModule.forFeatureAsync([
                {name:catName,
                useFactory:function(schema:SchemaDefinition){return schema.category()}
                ,inject:[SchemaDefinition]},

                {name:userName,
                useFactory:function(schema:SchemaDefinition){return schema.user()}
                ,inject:[SchemaDefinition]},

                {name:brandName,
                useFactory:function(schema:SchemaDefinition){return schema.brand()}
                ,inject:[SchemaDefinition]},

                {name:subName,
                useFactory:function(schema:SchemaDefinition){return schema.subcategory()}
                ,inject:[SchemaDefinition]},

                {name:prodName,
                useFactory:function(schema:SchemaDefinition){return schema.product()},
                inject:[SchemaDefinition]},
            ])
            ,apiModule],
    providers:[ProductServices],
    controllers:[ProductController]
})
export class ProductModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(ProductController);
    }
};