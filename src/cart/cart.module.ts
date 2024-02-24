import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { name as userName } from "src/user/user.entity";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { CartServices } from "./cart.service";
import { CartController } from "./cart.controller";
import { name as productName } from "src/product/product.entity";
import { name as cartName } from "./cart.entity";
import { name as couponName } from "src/coupon/coupon.entity";


@Module({
    imports:
    [SchemaDefinitionModule,MongooseModule.forFeatureAsync([
        {
            name:productName
            ,useFactory:function(schema:SchemaDefinition){
                return schema.product();
            },inject:[SchemaDefinition]
        },
        {
            name:userName,
            useFactory:function(schema:SchemaDefinition){
                return schema.user();
            },inject:[SchemaDefinition]
        },
        {
            name:cartName,
            useFactory:function(schema:SchemaDefinition){
                return schema.cart();
            },inject:[SchemaDefinition]
        },
        {
            name:couponName,
            useFactory:function(schema:SchemaDefinition){
                return schema.coupon();
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