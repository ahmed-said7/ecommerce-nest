import { IsMobilePhone, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateOrderDto{
    @IsNotEmpty()
    @IsMobilePhone('ar-EG')
    phone: string;
    @IsNotEmpty()
    @IsString()
    city: string;
    @IsNotEmpty()
    @IsNumber()
    postalCode: string;
};