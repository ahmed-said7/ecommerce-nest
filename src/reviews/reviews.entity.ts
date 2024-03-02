import {  Global, Injectable, Module } from "@nestjs/common";
import {EventEmitter2, EventEmitterModule} from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";
import mongoose, { Schema,ObjectId, Query } from "mongoose";

export const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
},{ timestamps: true }
);

@Injectable()
export class InitializeReviewSchema {
    review:Schema;
    constructor( private events:EventEmitter2 ){
        const self=this;
        reviewSchema.pre<Query<ReviewDoc[]|ReviewDoc,ReviewDoc>>(/^find/ig,function(){
            this.populate({ path:"user",select:"name image"  });
        });
        reviewSchema.post('save',function(){
            self.events.emit('review-saved',{product:this.product});
            // self.updateProduct(this.product);
        });
        reviewSchema.post("deleteOne",{document:true,query:false},function(){
            // self.updateProduct(this.product);
            self.events.emit('review-removed',{product:this.product});
        });
        
        this.review=reviewSchema;
    };
};


@Global()
@Module({providers:[InitializeReviewSchema],exports:[InitializeReviewSchema]})
export class InitializedReviewSchemaModule{};

export const name="Review";

export interface ReviewDoc extends mongoose.Document {
    review: string;
    rating: number;
    user: ObjectId;
    product: ObjectId;
};
