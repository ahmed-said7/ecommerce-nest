import {  MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
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
import { Models } from "src/enums/models.enum";
import { WishlistServices } from "./wishlist/wishlist.service";
import { AddressServices } from "./address/adress.service";
import { WishlistController } from "./wishlist/wishlist.controller";
import { addressController } from "./address/address.controller";
import { InitializeProductSchema, InitializedProductSchemaModule } from "src/product/product.entity";
import { InitializedUserSchema, InitializedUserSchemaModule } from "./user.entity";


@Module({
    imports:[InitializedUserSchemaModule,InitializedProductSchemaModule,
        MongooseModule.forFeatureAsync([{
        name:Models.USER,
        useFactory:function(schema:InitializedUserSchema) {
            return schema.user;
        },inject:[InitializedUserSchema]
    },{
        name:Models.PRODUCT,
        useFactory:function(schema:InitializeProductSchema) {
            return schema.product;
        },inject:[InitializeProductSchema]
    }]) , apiModule , NodemailerModule ],
    controllers:[AuthContoller,UserContoller,LoggedContoller,WishlistController,addressController],
    providers:[AuthServices,{provide:"folder",useValue:"user"}
    ,UserServices,LoggedUserServices,WishlistServices,AddressServices]
})


export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware)
            .forRoutes
            (UserContoller,LoggedContoller,WishlistController,addressController);
    };
};