import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { ProductServices } from "./product.service";
import { ProductController } from "./product.controller";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { ReviewModule } from "src/reviews/reviews.module";
import { Models } from "src/enums/models.enum";


@Module({
    imports:[
        ReviewModule,
        SchemaDefinitionModule,
        MongooseModule.forFeatureAsync([
                {name:Models.CATEGOY,
                useFactory:function(schema:SchemaDefinition){return schema.category()}
                ,inject:[SchemaDefinition]},

                {name:Models.USER,
                useFactory:function(schema:SchemaDefinition){return schema.user()}
                ,inject:[SchemaDefinition]},

                {name:Models.BRAND,
                useFactory:function(schema:SchemaDefinition){return schema.brand()}
                ,inject:[SchemaDefinition]},

                {name:Models.SUBCATEGORY,
                useFactory:function(schema:SchemaDefinition){return schema.subcategory()}
                ,inject:[SchemaDefinition]},

                {name:Models.PRODUCT,
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