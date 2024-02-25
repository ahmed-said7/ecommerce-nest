import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { User } from "src/decorator/user.decorator";
import { UserDoc } from "../user.entity";
import { ObjectId } from "mongoose";
import { AuthorizationGuard } from "src/guards/user.guard";
import { Roles } from "src/decorator/roles.decorator";
import { AddressServices } from "./adress.service";
import { CreateAddressDto } from "../dto/address.dto";

@Controller('address')
export class addressController {
    constructor(private addressService: AddressServices){};
    @Post()
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    addAddress(@User() user:UserDoc,@Body() body:CreateAddressDto){
        return this.addressService.addAddress(body,user);
    };
    @Patch(':id')
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    removeFromWishlist(@User() user:UserDoc,@Param('id') id:ObjectId){
        return this.addressService.removeAddress(id,user);
    };
    @Get()
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    getAddress(@User() user:UserDoc){
        return this.addressService.getAddress(user);
    };
};