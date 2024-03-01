import * as mongoose  from "mongoose";

export const userSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true,trim:true},
    name:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    role:{type:String,enum:['admin','user','manager'],default:"user"},
    passwordChangedAt:Date,
    passwordResetCode:String,
    passwordResetCodeExpires:Date,
    passwordResetCodeVertified:Boolean,
    googleAuth:{type:Boolean,default:false},
    active:{type:Boolean,default:true},
    address:[{
        street:String,
        postalCode:String,
        phone:String,
        city:String,
        details:String
    }],
    image:String,
    wishlist:[{type:mongoose.Types.ObjectId,ref:"Product"}]
    },{ timestamps:true }); 



export interface UserDoc extends mongoose.Document {
    googleAuth: boolean ;
    name:string;
    email:string;
    password:string;
    role:string;
    passwordChangedAt?:Date;
    passwordResetCode?:string;
    passwordResetCodeExpires?:Date;
    passwordResetCodeVertified?:boolean;
    active:boolean;
    image:string;
    address:{
        street:string,
        postalCode:string,
        phone:string,
        city:string,
        details:string
    }[],
    wishlist: mongoose.ObjectId[]
};

export const name='User';
