import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ReviewServices } from "./reviews.service";
import { ReviewController } from "./reviews.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { apiFactory } from "src/utils/api.factory";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SchemaDefinition, SchemaDefinitionModule } from "src/schemaDefinitions/schema.definition";
import { Models } from "src/enums/models.enum";
import { userSchema } from "src/user/user.entity";
import { productSchema } from "src/product/product.entity";


@Module({
    exports:[ReviewServices],
    providers:[apiFactory,ReviewServices],
    controllers:[ReviewController],
    imports:[SchemaDefinitionModule,
        EventEmitterModule.forRoot(),
        MongooseModule.forFeatureAsync([
            {
                name:Models.PRODUCT,
                useFactory:
                function(){return productSchema}
            },
            {
                    name:Models.USER,
                    useFactory:function(){return userSchema }
            },
            {
                name:Models.REVIEW,
                useFactory:function( schema:SchemaDefinition ){
                    return schema.reviews();
                },
                inject:[SchemaDefinition]
            }
        ])
    ]
})
export class ReviewModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(ReviewController);
    };
};