import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryServices } from "./category.services";
import { CategoryController } from "./category.controller";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { SubcategoryModule } from "src/subcategory/subcategory.module";
import { Models } from "src/enums/models.enum";
import { InitializedUserSchema, InitializedUserSchemaModule, userSchema } from "src/user/user.entity";
import { InitializedCategorySchema, InitializedCategorySchemaModule, categorySchema } from "./category.entity";
import { StrategyModule } from "src/strategy/strategy.module";


@Module({
    imports:
    [SubcategoryModule,InitializedUserSchemaModule,InitializedCategorySchemaModule,
        MongooseModule.forFeatureAsync([
        {
            name:Models.CATEGOY
            ,useFactory:function(schema:InitializedCategorySchema){
                return schema.category;
            },inject:[InitializedCategorySchema]
        },
        {
            name:Models.USER,
            useFactory:function(schema:InitializedUserSchema){
                return schema.user;
            },inject:[InitializedUserSchema]
        }
    ]),apiModule,StrategyModule],
    providers:[CategoryServices,
        {provide:'folder',useValue:"category"}],
    controllers:[CategoryController]
})

export class CategoryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(CategoryController)
    }
};