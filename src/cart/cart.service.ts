import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import mongoose, { Model, ObjectId } from "mongoose";
import { ProductDoc , name as prodName } from "src/product/product.entity";
import { apiFactory } from "src/utils/api.factory";
import { CartDoc , name as cartName } from "./cart.entity";
import { UserDoc } from "src/user/user.entity";
import { CouponDoc,name as couponName } from "src/coupon/coupon.entity";



export interface addProductToCart {
    product:mongoose.Types.ObjectId;
    color:string;
    quantity?:number;
    price?:number;
};
export interface UpdateProductQuantity {
    product:mongoose.Types.ObjectId;
    quantity:number;
};

@Injectable()
export class CartServices {
    constructor(
        @InjectModel(prodName) private prod:Model<ProductDoc>,
        @InjectModel(cartName) private cart:Model<CartDoc>,
        @InjectModel(couponName) private coupon:Model<CouponDoc>,
        private api:apiFactory<CartDoc>
    ){};
    async addProductToCart(user:UserDoc,body:addProductToCart){
        body.quantity=body.quantity || 1 ;
        let cart=await this.cart.findOne({user:user._id});
        const product=await this.validateProduct(body.product);
        body.price= product.priceAfterDiscount ? product.priceAfterDiscount : product.price;
        if(! cart ){
            cart=await this.cart.create({
                cartItems:[body],
                user: user._id
            });
        }else {
            const idx=cart.cartItems.
                findIndex
                ( item => item.product.toString() === body.product.toString() && body.color === item.color );
            if(idx > -1){
                cart.cartItems[idx].quantity=body.quantity;
            } else {
                cart.cartItems.push(
                    {price:body.price,product:body.product,quantity:body.quantity,color:body.color});
            };
            await cart.save();
        };
        cart.totalCartPrice=this.calcPrice(cart.cartItems);
        cart.totalPriceAfterDiscount=undefined;
        return { cart };
    };
    async updateProductQuantity(user:UserDoc,body:UpdateProductQuantity){
        let cart=await this.cart.findOne({user:user._id});
        if(!cart){
            throw new HttpException('cart not found',400);
        };
        const idx=cart.cartItems.findIndex( item => item.product.toString() === body.product.toString() );
        if(idx > -1){
            cart.cartItems[idx].quantity=body.quantity;
            cart.totalCartPrice=this.calcPrice(cart.cartItems);
            cart.totalPriceAfterDiscount=undefined;
            await cart.save();
        };
        return {cart};
    };
    async deleteLoggedUserCart(user:UserDoc){
        let cart=await this.cart.findOne({user:user._id});
        if(!cart){
            throw new HttpException('cart not found',400);
        };
        await cart.deleteOne();
        return { cart: cart , status:"deleted" };
    };
    async getLoggedUserCart(user:UserDoc){
        let cart=await this.cart.findOne({user:user._id});
        if(!cart){
            throw new HttpException('cart not found',400);
        };
        return { cart: cart};
    };
    async deleteCart(id:ObjectId){
        return this.api.deleteOne(this.cart,id);
    };
    async deleteItemFromCart(user:UserDoc,_id:mongoose.Types.ObjectId){
        let cart=await this.cart.findOneAndUpdate
            ( {user:user._id} , { $pull : { cartItems : { _id } }  } , { new:true } );
        if(!cart){
            throw new HttpException('cart not found',400);
        };
        cart.totalCartPrice=this.calcPrice(cart.cartItems);
        cart.totalPriceAfterDiscount=undefined;
        await cart.save();
        return { cart }
    };
    async applyCoupon(user:UserDoc,name: string){
        const coupon=await this.coupon.findOne({ name , expire:{ $gt : Date.now() }});
        if(! coupon ){
            throw new HttpException('Coupon not found',400);
        };
        const cart=await this.cart.findOne({user:user._id});
        if(!cart){
            throw new HttpException('cart not found',400);
        };
        const ratio=coupon.discount / 100;
        cart.totalPriceAfterDiscount=cart.totalCartPrice - cart.totalCartPrice*ratio;
        await cart.save();
        return {cart};
    };
    private calcPrice(items:CartDoc['cartItems']){
        let sum=0;
        items.forEach( ( item ) => { sum += item.price * item.quantity });
        return sum;
    };
    private async validateProduct(id:mongoose.Types.ObjectId){
        const data=await this.prod.findById(id);
        if(!data){
            throw new HttpException('Product not found',400);
        };
        return data;
    };
};