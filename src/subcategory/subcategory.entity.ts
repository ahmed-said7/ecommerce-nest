import mongoose from "mongoose";

export const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true
    },
    image:String,
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
},{ timestamps: true }
);

export interface SubcategoryDoc extends mongoose.Document {
    name:string;
    image:string;
    category:mongoose.Types.ObjectId;
};

export const name='Subcategory';