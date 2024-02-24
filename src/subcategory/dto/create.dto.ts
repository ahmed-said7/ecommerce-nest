import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose, { ObjectId } from "mongoose";

export class CreateSubcategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsMongoId()
    category: ObjectId;
};