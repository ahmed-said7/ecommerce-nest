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
    active:{type:Boolean,default:true},
    image:String
    
    },{ timestamps:true }); 

export interface UserDoc extends mongoose.Document {
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
};

export const name='User';
