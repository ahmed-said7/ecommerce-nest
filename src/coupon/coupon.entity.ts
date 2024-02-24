import mongoose from "mongoose";
export const name='coupon';
export const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    expire: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
},
    { timestamps: true }
);

export interface CouponDoc extends mongoose.Document {
    name: string,
    expire: Date,
    discount: number
};