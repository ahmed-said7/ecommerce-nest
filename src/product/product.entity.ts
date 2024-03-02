import { Global, Injectable, Module} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import mongoose, { Schema } from "mongoose";
import { Query } from "mongoose";

export const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: true
    },
    priceAfterDiscount: {
        type: Number,
        validate: function(value: number){
            return this.price > value;
        }
    },
    colors: [String],
    imageCover: {
        type: String,
        required: true
    },
    images: [String],
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategories: [{
        type: mongoose.Types.ObjectId,
        ref: 'Subcategory',
    }],
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
    },
    ratingAverage: {
        type: Number,
        min: 1,
        max: 5
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

productSchema.pre('save',function(next){
    console.log(this);
    return next();
});


export const name="Product";

export interface ProductDoc extends mongoose.Document {
    title: string;
    description: string;
    quantity: number;
    sold: number;
    price: number;
    priceAfterDiscount: number;
    colors: string [];
    imageCover: string;
    images: string [];
    category: mongoose.Types.ObjectId;
    subcategories: mongoose.Types.ObjectId [];
    brand: mongoose.Types.ObjectId;
    ratingAverage: number;
    ratingQuantity: number;
};

@Injectable()
export class InitializeProductSchema {
    product:Schema;
    constructor( private config : ConfigService ){
        const self=this;
        productSchema.pre<Query<ProductDoc[]|ProductDoc,ProductDoc>>(/^find/ig,function(){
            this
                .populate({ path:"brand",select:"name image -_id" })
                .populate({ path:"category",select:"name image -_id" });
        });
        productSchema.post<ProductDoc>('init',function(doc){
            if(doc.imageCover){
                doc.imageCover=`${self.config.get<string>('root_url')}/product/${doc.imageCover}`;
            };
            if(doc.images){
                const images = [];
                doc.images.forEach ( ( img:string ) => { 
                    images.push(`${self.config.get<string>('root_url')}/product/${img}`)
                });
                doc.images=images;
            };
        });
        this.product=productSchema;
    };
};


@Global()
@Module({providers:[InitializeProductSchema],exports:[InitializeProductSchema]})
export class InitializedProductSchemaModule{};