import { MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthContoller} from "./auth/auth.controller";
import { AuthServices} from "./auth/auth.service";
import { apiModule } from "../utils/api";
import { NodemailerModule } from "src/nodemailer/nodemailer.module";
import { LoggedContoller } from "./logged-user/logged.controller";
import { UserContoller } from "./admin-features/user.controller";
import { UserServices } from "./admin-features/user.service";
import { LoggedUserServices } from "./logged-user/logged.services";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SchemaDefinition, SchemaDefinitionModule } from "src/schemaDefinitions/schema.definition";
import { Models } from "src/enums/models.enum";
import { WishlistServices } from "./wishlist/wishlist.service";
import { AddressServices } from "./address/adress.service";
import { WishlistController } from "./wishlist/wishlist.controller";
import { addressController } from "./address/address.controller";

@Module({
    imports:[SchemaDefinitionModule,MongooseModule.forFeatureAsync([{
        name:Models.USER,
        useFactory:function(schema:SchemaDefinition) {
            return schema.user();
        },inject:[SchemaDefinition]
    }]) , apiModule , NodemailerModule ],
    controllers:[AuthContoller,UserContoller,LoggedContoller,WishlistController,addressController],
    providers:[AuthServices,UserServices,LoggedUserServices,WishlistServices,AddressServices]
})

export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware)
            .forRoutes(UserContoller,LoggedContoller,WishlistController,addressController);
    };
};