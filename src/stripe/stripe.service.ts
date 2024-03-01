import { HttpException, Inject, Injectable} from "@nestjs/common";
import {Stripe} from "stripe";

@Injectable()
export class StripeService {
    Client: Stripe|undefined=undefined;
    constructor(@Inject('secret') secret:string  ){
        this.Client=new Stripe( secret , { apiVersion : "2023-10-16" });
    };
    get client(){
        if(this.Client){
            throw new HttpException('stripe gateway error',400);
        };
        return this.Client;
    };
};
