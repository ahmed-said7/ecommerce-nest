import { Global, Injectable, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import mongoose, { Schema } from "mongoose";

export const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true
    },
    image:String
},{ timestamps: true }
);


export interface CategoryDoc extends mongoose.Document {
    name:string;
    image:string;
};

@Injectable()
export class InitializedCategorySchema {
    category:Schema;
    constructor(private config:ConfigService){
        const self=this;
        categorySchema.post<CategoryDoc>('init',function(doc){
            const image=doc.image;
            doc.image=`${self.config.get<string>('root_url')}/category/${image}`;
        });
        this.category=categorySchema;
    };
};

@Global()
@Module({providers:[InitializedCategorySchema],exports:[InitializedCategorySchema]})
export class InitializedCategorySchemaModule{};

