import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { ObjectId } from "mongoose";



export class UpdateReviewDto {
    @IsOptional()
    @IsString()
    review:string;
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating:number;
    @IsOptional()
    @IsMongoId()
    product:ObjectId
};