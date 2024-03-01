import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BrandServices } from "./brand.services";
import { BrandController } from "./brand.controller";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinition, SchemaDefinitionModule } from "src/schemaDefinitions/schema.definition";
import { Models } from "src/enums/models.enum";




@Module({
    imports:[
        SchemaDefinitionModule,
        MongooseModule.forFeatureAsync
        ([
            {
                name:Models.BRAND,useFactory:function(schema:SchemaDefinition){
                    return schema.brand();
                }
                ,inject:[SchemaDefinition]
            },
            {
                name:Models.USER,useFactory:function(schema:SchemaDefinition){
                    return schema.user();
                }
                ,inject:[SchemaDefinition]
            }
        ])
        ,apiModule],
    providers:[BrandServices,{provide:"folder",useValue:"brand"}],
    controllers:[BrandController]
})
export class BrandModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(BrandController);
    }
};