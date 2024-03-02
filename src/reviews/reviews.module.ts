import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ReviewServices } from "./reviews.service";
import { ReviewController } from "./reviews.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { apiFactory } from "src/utils/api.factory";
import { Models } from "src/enums/models.enum";
import { InitializedUserSchema, InitializedUserSchemaModule } from "src/user/user.entity";
import { InitializeProductSchema, InitializedProductSchemaModule  } from "src/product/product.entity";
import { InitializeReviewSchema, InitializedReviewSchemaModule } from "./reviews.entity";


@Module({
    exports:[ReviewServices],
    providers:[apiFactory,ReviewServices],
    controllers:[ReviewController],
    imports:[
        MongooseModule.forFeatureAsync([
            {
                name:Models.PRODUCT,
                useFactory
                :function(schema:InitializeProductSchema){return schema.product},
                inject:[InitializeProductSchema]
            },
            {
                name:Models.USER,
                useFactory:function(schema:InitializedUserSchema){
                    return schema.user
                },inject:[InitializedUserSchema]
            },
            {
                name:Models.REVIEW,
                useFactory
                :function(schema:InitializeReviewSchema){return schema.review},
                inject:[InitializeReviewSchema]
            }
        ])
        ,InitializedProductSchemaModule
        ,InitializedReviewSchemaModule,InitializedUserSchemaModule
    ]
})


export class ReviewModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(ReviewController);
    };
};