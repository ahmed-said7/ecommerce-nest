import mongoose from "mongoose";

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

export const name='Category';

