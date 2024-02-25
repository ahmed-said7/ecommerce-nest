import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {Stripe} from "stripe";
@Injectable()
export class StripeService {
    constructor(private config:ConfigService){};
    get client(){
        const secret=this.config.get<string>('secret_key');
        console.log(secret);
        const stripe=new Stripe( secret , { apiVersion : "2023-10-16" } );
        return stripe;
    };
};