import { Global, Injectable, Module} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import mongoose, { Schema } from "mongoose";
import * as bcrypt from "bcryptjs"; 

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

@Injectable()
export class InitializedUserSchema {
    user:Schema;
    constructor(private config:ConfigService){
        const self = this;
        userSchema.pre('save',async function(next){
            if( this.isModified('password') ){
                this.password=await bcrypt.hash(this.password,10);
            };
            return next()
        });
        userSchema.post<UserDoc>('init',function(doc){
            const image=doc.image;
            doc.image=`${self.config.get<string>('root_url')}/subcategory/${image}`;
        });
        this.user=userSchema;
    };
};

@Global()
@Module({providers:[InitializedUserSchema],exports:[InitializedUserSchema]})
export class InitializedUserSchemaModule{};

export const name='User';
