import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { ObjectId } from "mongoose";



export class CreateReviewDto {
    @IsOptional()
    @IsString()
    review:string;
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating:number;
    @IsNotEmpty()
    @IsMongoId()
    product:ObjectId
};