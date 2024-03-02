import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BrandServices } from "./brand.services";
import { BrandController } from "./brand.controller";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { Models } from "src/enums/models.enum";
import { InitializedUserSchema, InitializedUserSchemaModule } from "src/user/user.entity";
import { InitializedBrandSchema, InitializedBrandSchemaModule } from "./brand.entity";




@Module({
    imports:[
        MongooseModule.forFeatureAsync
        ([
            {
                name:Models.BRAND,useFactory:function(schema:InitializedBrandSchema){
                    return schema.brand;
                }
                ,inject:[InitializedBrandSchema]
            },
            {
                name:Models.USER,useFactory:function(schema:InitializedUserSchema){
                    return schema.user;
                }
                ,inject:[InitializedUserSchema]
            }
        ])
        ,apiModule,
        InitializedBrandSchemaModule,InitializedUserSchemaModule],
    providers:[
        BrandServices,{provide:"folder",useValue:"brand"}],
    controllers:[BrandController]
})
export class BrandModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(BrandController);
    }
};