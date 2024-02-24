import mongoose from "mongoose";

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