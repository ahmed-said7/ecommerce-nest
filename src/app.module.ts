
import { Module, forwardRef,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './reviews/reviews.module';
import {ConfigModule,ConfigService} from "@nestjs/config";
import { CartModule } from './cart/cart.module';
import { CouponModule } from './coupon/coupon.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { OrderModule } from './order/order.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StrategyModule } from './strategy/strategy.module';
import { PassportModule } from '@nestjs/passport';
// import { OrderModule } from './order/order.module';
// OrderModule

@Module({
  imports: [
    EventEmitterModule.forRoot({global:true}),
    ConfigModule.forRoot({isGlobal:true,envFilePath:"src/.env"}),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:function(config:ConfigService){
        return { uri : config.get<string>('url') };
    }}),
    SubcategoryModule,
    UserModule,OrderModule
    ,BrandModule,CartModule,CouponModule,
    CategoryModule,
    ProductModule,ReviewModule,StrategyModule,
    PassportModule.register({session:true})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{
  
}
