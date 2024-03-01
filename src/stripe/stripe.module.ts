import { ConfigurableModuleBuilder, DynamicModule, Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StripeService } from "./stripe.service";


@Module({})

export class StripeModule  {
    static register():DynamicModule{
        const providerSecret:Provider={provide:"secret",useFactory(config:ConfigService){
            return config.get<string>('secret_key')
        },inject:[ConfigService]};
        return {    
            module : StripeModule,
            providers : [ StripeService , ConfigService,providerSecret ] ,
            exports:[ StripeService ] 
        };
    };
};