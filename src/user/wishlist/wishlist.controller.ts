import {Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { WishlistServices } from "./wishlist.service";
import { User } from "src/decorator/user.decorator";
import { UserDoc } from "../user.entity";
import { ObjectId } from "mongoose";
import { AuthorizationGuard } from "src/guards/user.guard";
import { Roles } from "src/decorator/roles.decorator";

@Controller('wishlist')
export class WishlistController {
    constructor(private wishlistService: WishlistServices){};
    @Patch(':id')
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    addProductToWishlist(@User() user:UserDoc,@Param('id') id:ObjectId){
        return this.wishlistService.addToWishlist(id,user);
    };
    @Delete(':id')
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    removeFromWishlist(@User() user:UserDoc,@Param('id') id:ObjectId){
        return this.wishlistService.removeFromWishlist(id,user);
    };
    @Get()
    @Roles(['admin','user','manager'])
    @UseGuards(AuthorizationGuard)
    getWishlist(@User() user:UserDoc){
        return this.wishlistService.getWishlist(user);
    };
};