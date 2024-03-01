import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { CartServices } from "./cart.service";
import { CartController } from "./cart.controller";
import { Models } from "src/enums/models.enum";
import { productSchema } from "src/product/product.entity";
import { userSchema } from "src/user/user.entity";
import { couponSchema } from "src/coupon/coupon.entity";


@Module({
    imports:
    [SchemaDefinitionModule,MongooseModule.forFeatureAsync([
        {
            name:Models.PRODUCT
            ,useFactory:function(){
                return productSchema;
            },inject:[SchemaDefinition]
        },
        {
            name:Models.USER,
            useFactory:function(){
                return userSchema;
            },inject:[SchemaDefinition]
        },
        {
            name:Models.CART,
            useFactory:function(schema:SchemaDefinition){
                return schema.cart();
            },inject:[SchemaDefinition]
        },
        {
            name:Models.COUPON,
            useFactory:function(){
                return couponSchema;
            },inject:[SchemaDefinition]
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