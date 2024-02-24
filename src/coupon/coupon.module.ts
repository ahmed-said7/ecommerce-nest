import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";

import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { name } from "./coupon.entity";
import { name as userName} from "src/user/user.entity";
import { CouponController } from "./coupon.controller";
import { CouponServices } from "./coupon.service";
import { CategoryController } from "src/category/category.controller";


@Module({
    imports:
    [SchemaDefinitionModule,MongooseModule.forFeatureAsync([
        {
            name:name
            ,useFactory:function(schema:SchemaDefinition){
                schema.coupon();
            },inject:[SchemaDefinition]
        },
        {
            name:userName,
            useFactory:function(schema:SchemaDefinition){
                return schema.user();
            },inject:[SchemaDefinition]
        }
    ]),apiModule],
    providers:[CouponServices],
    controllers:[CouponController]
})

export class CouponModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(CouponController)
    }
};