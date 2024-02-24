import { IsEmail,IsString,IsNotEmpty, IsOptional, IsEnum  } from "class-validator";
import { Roles } from "./user.role.enum";

export class UpdateUserDto {
    
    @IsOptional()
    @IsString()
    name: string;
    
    @IsOptional()
    @IsEmail()
    email: string;
    
    @IsOptional()
    @IsEnum(Roles)
    role: string;

    @IsOptional()
    @IsString()
    image: string;

};