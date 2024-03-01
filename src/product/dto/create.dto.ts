import {ObjectId} from "mongoose";
import { 
        IsArray, IsMongoId, IsNotEmpty, 
        IsNumber, IsOptional, IsString, ValidateNested 
    } from "class-validator";
import { Transform } from "class-transformer";


export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
    
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    
    @IsOptional()
    @IsNumber()
    sold: number;
    
    @IsNotEmpty()
    @IsNumber()
    price: number;
    
    @IsOptional()
    @IsNumber()
    priceAfterDiscount: string;
    
    @IsOptional()
    @IsArray()
    colors: string [];
    
    @IsNotEmpty()
    @IsMongoId()
    category: ObjectId;
    
    @IsNotEmpty()
    @IsArray()
    subcategories: ObjectId [];
    
    @IsOptional()
    @IsArray()
    images: string [];
    
    @IsNotEmpty()
    @IsString()
    imageCover: string;

    @IsNotEmpty()
    @IsMongoId()
    brand: ObjectId;
    
    @IsOptional()
    @IsNumber()
    ratingAverage: number;
    
    @IsOptional()
    @IsNumber()
    ratingQuantity: number;
    
    

};