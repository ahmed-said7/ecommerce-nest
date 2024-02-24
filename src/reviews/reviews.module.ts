import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ReviewServices } from "./reviews.service";
import { ReviewController } from "./reviews.controller";
import { InjectModel, MongooseModule } from "@nestjs/mongoose";
import { productSchema,name as productName } from "src/product/product.entity";
import { reviewSchema,name as reviewName} from "./reviews.entity";
import { userSchema,name as userName,UserDoc } from "src/user/user.entity";
import { Model } from "mongoose";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { apiFactory } from "src/utils/api.factory";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { SchemaDefinition, SchemaDefinitionModule } from "src/schemaDefinitions/schema.definition";


@Module({
    providers:[ReviewServices,apiFactory],
    controllers:[ReviewController],
    imports:[SchemaDefinitionModule,
        EventEmitterModule.forRoot(),
        MongooseModule.forFeatureAsync([
            {name:productName,
                useFactory:function(schema:SchemaDefinition)
                {return schema.product()},inject:[SchemaDefinition]},
            {name:userName,
                    useFactory:function(schema:SchemaDefinition){return schema.user() }
                    ,inject:[SchemaDefinition]
            },
            {
                name:reviewName,
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