import { Module,MiddlewareConsumer, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StripeModule } from "src/stripe/stripe.module";
import { OrderServices } from "./order.service";
import { OrderController } from "./order.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { apiModule } from "src/utils/api";
import { SchemaDefinitionModule,SchemaDefinition } from "src/schemaDefinitions/schema.definition";
import { Models } from "src/enums/models.enum";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";

@Module({
    imports:[
        StripeModule.register(),apiModule,
        SchemaDefinitionModule,
        MongooseModule.forFeatureAsync([
                {name:Models.USER,
                useFactory:function(schema:SchemaDefinition){return schema.user()}
                ,inject:[SchemaDefinition]},
                {name:Models.PRODUCT,
                useFactory:function(schema:SchemaDefinition){return schema.product()},
                inject:[SchemaDefinition]},
                {name:Models.ORDER,
                    useFactory:function(schema:SchemaDefinition){return schema.order()},
                    inject:[SchemaDefinition]},
                {name:Models.CART,
                        useFactory:function(schema:SchemaDefinition){return schema.cart()},
                        inject:[SchemaDefinition]}
            ])
    ],
    providers:[ConfigService,OrderServices],
    controllers:[OrderController]
})


export class OrderModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware)
            .exclude({ path:"order/webhook" , method:RequestMethod.POST })
            .forRoutes(OrderController);
    }
};