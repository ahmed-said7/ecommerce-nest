import mongoose from "mongoose";

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
export const name="Brand";
