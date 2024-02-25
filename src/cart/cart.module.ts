import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { CartServices } from "./cart.service";
import { CartController } from "./cart.controller";
import { Models } from "src/enums/models.enum";


@Module({
    imports:
    [SchemaDefinitionModule,MongooseModule.forFeatureAsync([
        {
            name:Models.PRODUCT
            ,useFactory:function(schema:SchemaDefinition){
                return schema.product();
            },inject:[SchemaDefinition]
        },
        {
            name:Models.USER,
            useFactory:function(schema:SchemaDefinition){
                return schema.user();
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