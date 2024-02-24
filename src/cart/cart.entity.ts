import mongoose, { ObjectId } from 'mongoose';
export const name="Cart";
export const cartSchema = new mongoose.Schema({
    cartItems: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1,
        },
            color: String,
            price: Number,
        }],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
},
    { timestamps: true }
);

export interface CartDoc extends mongoose.Document {
    cartItems: {
        product: mongoose.Types.ObjectId
        quantity: number,
        color: string,
        price: number,
        }[],
    totalCartPrice: number,
    totalPriceAfterDiscount: number,
    user: mongoose.Types.ObjectId
};