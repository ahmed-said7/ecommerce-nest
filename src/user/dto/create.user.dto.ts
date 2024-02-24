import { IsEmail,IsString,IsNotEmpty, IsOptional, IsEnum  } from "class-validator";
import { Roles } from "./user.role.enum";

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @IsOptional()
    @IsEnum(Roles)
    role: string;

    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;

    @IsOptional()
    @IsString()
    image: string;

};