import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { CartServices } from "./cart.service";
import { CartController } from "./cart.controller";
import { Models } from "src/enums/models.enum";
import { InitializeProductSchema, InitializedProductSchemaModule } from "src/product/product.entity";
import { InitializedUserSchema, InitializedUserSchemaModule } from "src/user/user.entity";
import { couponSchema } from "src/coupon/coupon.entity";
import { cartSchema } from "./cart.entity";


@Module({
    imports:
    [InitializedProductSchemaModule,InitializedUserSchemaModule,
        MongooseModule.forFeatureAsync([
        {
            name:Models.PRODUCT
            ,useFactory:function(schema:InitializeProductSchema){
                return schema.product;
            },inject:[InitializeProductSchema]
        },
        {
            name:Models.USER,
            useFactory:function(schema:InitializedUserSchema){
                return schema.user;
            },inject:[InitializedUserSchema]
        },
        {
            name:Models.CART,
            useFactory:function(){
                return cartSchema;
            }
        },
        {
            name:Models.COUPON,
            useFactory:function(){
                return couponSchema;
            }
        }
    ]),apiModule],
    providers:[CartServices],
    controllers:[CartController]
})

export class CartModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(CartController)
    }
};