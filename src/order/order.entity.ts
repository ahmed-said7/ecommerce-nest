import mongoose from "mongoose";
export const name='Order';

export const orderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cartItems: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
            color: String,
            price: Number,
        },
    ],
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingAddress: {
        phone: String,
        city: String,
        postalCode: String,
    },
    shippingPrice: {
        type: Number,
        default: 0,
    },

    totalOrderPrice: {
        type: Number,
    },

    paymentMethodType: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash',
    },

    isPaid: {
        type: Boolean,
        default: false,
    },

    paidAt: Date,
    
    isDelivered: {
        type: Boolean,
        default: false,
    },
    
    deliveredAt: Date,
},

{ timestamps: true }

);

export interface OrderDoc extends mongoose.Document {
    user: mongoose.Types.ObjectId,
    cartItems:
        {   
            product: mongoose.Types.ObjectId
            quantity: number,
            color: string,
            price: number,
        }[],
    taxPrice: number,
    shippingAddress: {
        phone: string,
        city: string,
        postalCode: string,
    },
    shippingPrice: number,
    totalOrderPrice: number,
    paymentMethodType: string,
    isPaid: boolean,
    paidAt: Date,
    isDelivered: boolean
    deliveredAt: Date,
};