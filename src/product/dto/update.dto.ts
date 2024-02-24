import {ObjectId} from "mongoose";
import { 
        IsArray, IsMongoId, IsNotEmpty, 
        IsNumber, IsOptional, IsString, ValidateNested 
    } from "class-validator";
import { Transform } from "class-transformer";


export class UpdateProductDto {
    @IsOptional()
    @IsString()
    title: string;
    @IsOptional()
    @IsString()
    description: string;
    @IsOptional()
    quantity: number;
    @IsOptional()
    sold: number;
    @IsOptional()
    price: number;
    @IsOptional()
    priceAfterDiscount: string;
    @IsOptional()
    colors: string [];
    @IsOptional()
    @IsMongoId()
    category: ObjectId;
    @IsOptional()
    subcategories: ObjectId [];
    @IsOptional()
    @IsMongoId()
    brand: ObjectId;
    @IsOptional()
    ratingAverage: number;
    @IsOptional()
    ratingQuantity: number;
    constructor(dto:Partial<UpdateProductDto>){
        Object.assign(this,dto);
    };
};