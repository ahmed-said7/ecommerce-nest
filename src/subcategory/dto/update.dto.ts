import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose, { ObjectId } from "mongoose";

export class UpdateSubcategoryDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsMongoId()
    category: ObjectId;
};