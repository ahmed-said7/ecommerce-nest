

import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";




export class UpdateCouponDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsDate()
    expire?: Date;
    @IsOptional()
    @IsNumber()
    discount?: number;
};