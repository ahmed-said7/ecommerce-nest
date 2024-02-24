import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBrandDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    image: string;
};