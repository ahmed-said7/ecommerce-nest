import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BrandServices } from "./brand.services";
import { brandSchema,name } from "./brand.entity";
import { BrandController } from "./brand.controller";
import { apiModule } from "src/utils/api";
import { userSchema,name as userName } from "src/user/user.entity";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinition, SchemaDefinitionModule } from "src/schemaDefinitions/schema.definition";




@Module({
    imports:[
        SchemaDefinitionModule,
        MongooseModule.forFeatureAsync
        ([
            {
                name:name,useFactory:function(schema:SchemaDefinition){
                    return schema.brand();
                }
                ,inject:[SchemaDefinition]
            },
            {
                name:userName,useFactory:function(schema:SchemaDefinition){
                    return schema.user();
                }
                ,inject:[SchemaDefinition]
            }
        ])
        ,apiModule],
    providers:[BrandServices],
    controllers:[BrandController]
})
export class BrandModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(BrandController);
    }
};