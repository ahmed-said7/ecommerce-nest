import { Body, Controller, Delete, Get, Param, Patch, Post, 
    Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import mongoose, { ObjectId } from "mongoose";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";
import { CartServices } from "./cart.service";
import { UpdateProductQuantityDto, addProductToCartDto } from "./dto/cart.dto";
import { User } from "src/decorator/user.decorator";
import { UserDoc } from "src/user/user.entity";



@Controller('cart')
export class CartController {
    constructor(private cartService: CartServices){};
    @Post("/add-product")
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    addProduct( @User() user:UserDoc,@Body() body:addProductToCartDto ){
        return this.cartService.addProductToCart(user,body);
    };

    @Delete()
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    deleteLoggedCart( @User() user:UserDoc ){
        return this.cartService.deleteLoggedUserCart(user);
    };
    
    @Delete(':id')
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    deleteCart(
        @Param('id') id:ObjectId,
        ){
        return this.cartService.deleteCart(id);
    };
    
    @Patch("update-product")
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    deleteProductQuantity(@User() user:UserDoc,@Body() body:UpdateProductQuantityDto ){
        return this.cartService.updateProductQuantity(user,body);
    };

    @Patch(":id")
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    deleteCartItem(@User() user:UserDoc,@Param('id') id:mongoose.Types.ObjectId){
        return this.cartService.deleteItemFromCart(user,id);
    };

    @Post(":name")
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    applyCoupon(@User() user:UserDoc,@Param('name') name:string){
        return this.cartService.applyCoupon(user,name);
    };
};