import { Global, Injectable, Module } from "@nestjs/common";
import {EventEmitter2, EventEmitterModule} from "@nestjs/event-emitter";
import mongoose, { ObjectId } from "mongoose";
import { UserDoc } from "src/user/user.entity";

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



export const name="Review";

export interface ReviewDoc extends mongoose.Document {
    review: string;
    rating: number;
    user: ObjectId;
    product: ObjectId;
};
