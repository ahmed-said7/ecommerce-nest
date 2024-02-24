import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose"

export class addProductToCartDto {
    @IsNotEmpty()
    @IsMongoId()
    product:mongoose.Types.ObjectId;
    @IsNotEmpty()
    @IsString()
    color:string;
    @IsOptional()
    @IsNumber()
    quantity?:number;
    @IsOptional()
    @IsNumber()
    price?:number;
};
export class UpdateProductQuantityDto {
    @IsNotEmpty()
    @IsMongoId()
    product:mongoose.Types.ObjectId;
    @IsNotEmpty()
    @IsNumber()
    quantity:number;
};