import { IsMobilePhone, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    street:string;
    @IsOptional()
    @IsString()
    postalCode:string;
    @IsNotEmpty()
    @IsMobilePhone('ar-EG')
    phone:string;
    @IsNotEmpty()
    @IsString()
    city:string;
    @IsOptional()
    @IsString()
    details:string;
};