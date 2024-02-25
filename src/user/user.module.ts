import { MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthContoller} from "./auth.controller";
import { AuthServices} from "./auth.service";
import { apiModule } from "../utils/api";
import { NodemailerModule } from "src/nodemailer/nodemailer.module";
import { LoggedContoller } from "./logged.controller";
import { UserContoller } from "./user.controller";
import { UserServices } from "./user.service";
import { LoggedUserServices } from "./logged.services";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinition, SchemaDefinitionModule } from "src/schemaDefinitions/schema.definition";
import { Models } from "src/enums/models.enum";

@Module({
    imports:[SchemaDefinitionModule,MongooseModule.forFeatureAsync([{
        name:Models.USER,
        useFactory:function(schema:SchemaDefinition) {
            return schema.user();
        },inject:[SchemaDefinition]
    }]) , apiModule , NodemailerModule ],
    controllers:[AuthContoller,UserContoller,LoggedContoller],
    providers:[AuthServices,UserServices,LoggedUserServices]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(UserContoller,LoggedContoller);
    };
};