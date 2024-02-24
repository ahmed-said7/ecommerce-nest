import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";




export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsDate()
    expire: Date;
    @IsNotEmpty()
    @IsNumber()
    discount: number;
};