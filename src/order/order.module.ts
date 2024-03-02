import { Module,MiddlewareConsumer, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OrderServices } from "./order.service";
import { OrderController } from "./order.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { Models } from "src/enums/models.enum";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { StripeModule } from "src/stripe/stripe.module";
import { InitializedUserSchema, InitializedUserSchemaModule } from "src/user/user.entity";
import { InitializeProductSchema, InitializedProductSchemaModule } from "src/product/product.entity";
import { cartSchema } from "src/cart/cart.entity";
import { InitializedOrderSchema, InitializedOrderSchemaModule } from "./order.entity";

@Module({
    imports:[
        InitializedOrderSchemaModule,
        InitializedProductSchemaModule,InitializedUserSchemaModule,
        StripeModule.register(),apiModule,
        MongooseModule.forFeatureAsync([
                {
                    name:Models.USER,
                    useFactory
                    :function(schema:InitializedUserSchema){return schema.user}
                    ,inject:[InitializedUserSchema]
                },
                {
                    name:Models.PRODUCT,
                    useFactory:
                    function(schema:InitializeProductSchema){return schema.product},
                    inject:[InitializeProductSchema]},
                {
                    name:Models.ORDER,
                    useFactory:function(schema:InitializedOrderSchema){return schema.order},
                    inject:[InitializedOrderSchema]
                },
                {
                    name:Models.CART,
                    useFactory:function(){return cartSchema}
                }
            ])
    ],
    providers:
    [
        ConfigService,OrderServices
    ],
    controllers:[OrderController]
})


export class OrderModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware)
            .exclude({ path:"order/webhook" , method:RequestMethod.POST })
            .forRoutes(OrderController);
    }
};