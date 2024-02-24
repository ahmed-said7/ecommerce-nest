import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { categorySchema, name } from "./category.entity";
import { CategoryServices } from "./category.services";
import { CategoryController } from "./category.controller";
import { apiModule } from "src/utils/api";
import { name as userName } from "src/user/user.entity";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { SubcategoryModule } from "src/subcategory/subcategory.module";


@Module({
    imports:
    [SubcategoryModule,SchemaDefinitionModule,MongooseModule.forFeatureAsync([
        {
            name:name
            ,useFactory:function(schema:SchemaDefinition){
                return schema.category();
            },inject:[SchemaDefinition]
        },
        {
            name:userName,
            useFactory:function(schema:SchemaDefinition){
                return schema.user();
            },inject:[SchemaDefinition]
        }
    ]),apiModule],
    providers:[CategoryServices],
    controllers:[CategoryController]
})

export class CategoryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(CategoryController)
    }
};