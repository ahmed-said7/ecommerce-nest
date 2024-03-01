import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { CouponController } from "./coupon.controller";
import { CouponServices } from "./coupon.service";
import { Models } from "src/enums/models.enum";
import { userSchema } from "src/user/user.entity";


@Module({
    imports:
    [SchemaDefinitionModule,MongooseModule.forFeatureAsync([
        {
            name:Models.COUPON
            ,useFactory:function(schema:SchemaDefinition){
                return schema.coupon();
            },inject:[SchemaDefinition]
        },
        {
            name:Models.USER,
            useFactory:function(){
                return userSchema;
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