import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models.enum";
import { InitializedUserSchema, InitializedUserSchemaModule }
from "src/user/user.entity";
import { GoogleStrategy } from "./passport.strategy";
import { StrategyController } from "./strategy.controller";
import passport from "passport";
import { SessionSerializer } from "./serializer";







@Module({
    imports:[
        InitializedUserSchemaModule,
        MongooseModule.forFeatureAsync(
            [
                {
                    name:Models.USER,
                    useFactory(schema:InitializedUserSchema){
                    return schema.user;
                },
                inject:[InitializedUserSchema]
            }
        ])
        ],
    controllers:[StrategyController],
    providers:[GoogleStrategy,SessionSerializer]
    ,exports:[SessionSerializer]
})

export class StrategyModule {};