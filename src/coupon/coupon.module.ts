import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { CouponController } from "./coupon.controller";
import { CouponServices } from "./coupon.service";
import { Models } from "src/enums/models.enum";
import { InitializedUserSchema, InitializedUserSchemaModule, userSchema } from "src/user/user.entity";
import { couponSchema } from "./coupon.entity";


@Module({
    imports:
    [InitializedUserSchemaModule,
        MongooseModule.forFeatureAsync([
        {
            name:Models.COUPON
            ,useFactory:function(){
                return couponSchema;
            }
        },
        {
            name:Models.USER,
            useFactory:function(schema:InitializedUserSchema){
                return schema.user;
            },inject:[InitializedUserSchema]
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