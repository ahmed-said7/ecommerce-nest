import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StripeService } from "./stripe.service";

@Module({})
export class StripeModule {
    static register():DynamicModule{
        return {    
            module : StripeModule,
            providers : [ StripeService , ConfigService ] ,
            exports:[ StripeService ] 
        };
    };
};