import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubcategoryController } from "./subcategory.controller";
import { SubcategoryServices } from "./subcategory.service";
import { apiModule } from "src/utils/api";
import { ProtectMiddleware } from "src/middlewares/protect.middleware";
import { Models } from "src/enums/models.enum";
import { InitializedCategorySchema, InitializedCategorySchemaModule } from "src/category/category.entity";
import { InitializedUserSchema, InitializedUserSchemaModule } from "src/user/user.entity";
import { InitializedSubcategorySchema, InitializedSubcategorySchemaModule } from "./subcategory.entity";


@Module({
    exports:[SubcategoryServices],
    imports:
    [   
        InitializedCategorySchemaModule,InitializedUserSchemaModule,
        InitializedSubcategorySchemaModule,
        apiModule, 
        MongooseModule.forFeatureAsync( [ 
            {
                name:Models.USER,
                useFactory:function(schema:InitializedUserSchema){
                    return schema.user;
                },inject:[InitializedUserSchema]
            },
            {
                name:Models.CATEGOY,
                useFactory
                :function(schema:InitializedCategorySchema){return schema.category},
                inject:[InitializedCategorySchema]
            },
                {
                    name:Models.SUBCATEGORY,
                    useFactory:function(schema:InitializedSubcategorySchema){
                    return schema.subcategory; }
                    ,inject:[InitializedSubcategorySchema]
                }
            ])
        ],
    providers:[{provide:"folder",useValue:"subcategory"},SubcategoryServices]
    , controllers:[SubcategoryController]
})


export class SubcategoryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProtectMiddleware).forRoutes(SubcategoryController);
    }
};