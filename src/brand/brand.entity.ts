import { Global, Injectable, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import mongoose, { Schema } from "mongoose";

export const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true
    },
    image:String
},{ timestamps: true }
);

export interface BrandDoc extends mongoose.Document {
    name:string;
    image:string;
};


@Injectable()
export class InitializedBrandSchema {
    brand:Schema;
    constructor(private config:ConfigService){
        const self=this;
        brandSchema.post<BrandDoc>('init',function(doc){
            if(doc.image){
                const image=doc.image;
                doc.image=`${self.config.get<string>('root_url')}/brand/${image}`;
            }
        });
        this.brand=brandSchema;
    };
};

@Global()
@Module({providers:[InitializedBrandSchema],exports:[InitializedBrandSchema]})
export class InitializedBrandSchemaModule{};
export const name="Brand";
