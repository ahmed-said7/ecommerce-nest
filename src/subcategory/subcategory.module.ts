import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { name as subName } from "./subcategory.entity";
import { SubcategoryController } from "./subcategory.controller";
import { SubcategoryServices } from "./subcategory.service";
import { name as catName } from "src/category/category.entity";
import { apiModule } from "src/utils/api";
import {  name as userName } from "src/user/user.entity";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinition} from "src/schemaDefinitions/schema.definition";


@Module({
    exports:[SubcategoryServices],
    imports:
    [apiModule, MongooseModule.forFeatureAsync( [ 
                {name:userName,useFactory:function(schema:SchemaDefinition) {
                    return schema.user();
                },inject:[SchemaDefinition] },
                {name:catName,useFactory:function(schema:SchemaDefinition) {
                    return schema.category();
                },inject:[SchemaDefinition] },
                {name:subName,useFactory:function(schema:SchemaDefinition) {
                    return schema.subcategory();
                },inject:[SchemaDefinition]  }
            ])],
    providers:[SubcategoryServices] , controllers:[SubcategoryController]
})


export class SubcategoryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(SubcategoryController);
    }
};