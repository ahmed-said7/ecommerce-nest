import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryServices } from "./category.services";
import { CategoryController } from "./category.controller";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { SubcategoryModule } from "src/subcategory/subcategory.module";
import { Models } from "src/enums/models.enum";


@Module({
    imports:
    [SubcategoryModule,SchemaDefinitionModule,MongooseModule.forFeatureAsync([
        {
            name:Models.CATEGOY
            ,useFactory:function(schema:SchemaDefinition){
                return schema.category();
            },inject:[SchemaDefinition]
        },
        {
            name:Models.USER,
            useFactory:function(schema:SchemaDefinition){
                return schema.user();
            },inject:[SchemaDefinition]
        }
    ]),apiModule],
    providers:[CategoryServices,{provide:'folder',useValue:"category"}],
    controllers:[CategoryController]
})

export class CategoryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(CategoryController)
    }
};