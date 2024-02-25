import { HttpException, Inject, Injectable } from "@nestjs/common";
import { name as orderName,OrderDoc } from "./order.entity";
import { CartDoc,name as cartName } from "src/cart/cart.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { ProductDoc , name as prodName } from "src/product/product.entity";
import { UserDoc, name as userName } from "src/user/user.entity";
import { apiFactory } from "src/utils/api.factory";
import { queryInterface } from "src/utils/api.features";
import {Stripe} from "stripe";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { StripeService } from "src/stripe/stripe.service";
import { Models } from "src/enums/models.enum";




interface createCashOrder {
    phone: string;
    city: string;
    postalCode: string;
};

@Injectable()
export class OrderServices {
    constructor(
        @InjectModel(Models.CART) private cart:Model<CartDoc>,
        @InjectModel(Models.ORDER) private order:Model<OrderDoc>,
        @InjectModel(Models.PRODUCT) private prod:Model<ProductDoc>,
        @InjectModel(Models.USER) private user:Model<UserDoc>,
        private Stripe:StripeService,
        private config:ConfigService,
        private api:apiFactory<OrderDoc>
    ){};
    async createCashOrder(user:UserDoc,body:createCashOrder){
        const taxPrice=10;
        const shippingPrice=0;
        const cart=await this.cart.findOne({user:user._id});
        if(!cart){
            throw new HttpException('cart not found',400);
        };
        const price=cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
        const order=await this.order.create({ 
            user : user._id ,cartItems:cart.cartItems,
            taxPrice,shippingPrice,shippingAddress:body,
            totalOrderPrice:(price+taxPrice+shippingPrice),
        });
        this.incrementProductSold(cart.cartItems,cart._id);
        return { order };
    };
    async updatePaidOrder(id:ObjectId){
        const order=await this.order.findOne({_id:id});
        if(!order){
            throw new HttpException('Order not found',400);
        };
        order.paidAt=new Date();
        order.isPaid=true;
        await order.save();
        return { order };
    };
    async updateDeliveredOrder(id:ObjectId){
        const order=await this.order.findOne({_id:id});
        if(!order){
            throw new HttpException('Order not found',400);
        };
        order.deliveredAt=new Date();
        order.isDelivered=true;
        await order.save();
        return { order };
    };
    async findOne(id:ObjectId){
        return this.api.getOne(this.order,id);
    };
    async getAllOrders(query:queryInterface){
        return this.api.getAll(this.order,query);
    };
    async checkoutSession(user:UserDoc,req:Request){
        const cart=await this.cart.findOne({user:user._id});
        if(!cart){
            throw new HttpException('cart not found',400);
        };
        const totalPrice=cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice ;
        const session=await this.Stripe.client.checkout.sessions.create({
            line_items:[
                {
                    price_data:
                    {
                    currency:"egp" , unit_amount:totalPrice*100,
                    product_data:{ name: user.name }
                    },
                    quantity:1,
                },
            ],
            mode:"payment",
            success_url:`${req.protocol}://${req.get('host')}/success`,
            cancel_url:`${req.protocol}://${req.get('host')}/cancel`,
            client_reference_id: cart._id,
            customer_email: user.email
        });
        return { session };
    };
    async webhookCheckout(req: Request){
        const sig=req.headers['stripe-signature'];
        const body=req.body;
        const secret=this.config.get<string>('secret_webhook');
        let event: Stripe.Event | undefined = undefined;
        try {
            event=this.Stripe.client.webhooks.constructEvent(body,sig,secret);
        }catch(err){
            console.log(err);
            throw new HttpException('webhook error',400);
        };
        if(event.type === 'checkout.session.completed'){
            const cartId=event.data.object.client_reference_id;
            const email=event.data.object.customer_email;
            this.handleOnlinePayment(cartId,email);
        };
    };
    private async handleOnlinePayment(cartId:string, email:string){
        const cart=await this.cart.findById(cartId);
        const user=await this.user.findOne({ email });
        const price=cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
        const order=await this.order.create({
            paymentMethodType:"card",
            cartItems:cart.cartItems,
            user:user._id,
            paidAt:new Date() , isPaid : false ,
            totalOrderPrice:price
        });
        console.log(order);
        this.incrementProductSold(cart.cartItems,cart._id);
    };
    private async incrementProductSold(items:CartDoc['cartItems'],id:ObjectId){
        const promises=items.map( (item) => {
            return this.prod.findByIdAndUpdate( 
                item.product , { $inc : { quantity : item.quantity*-1 ,sold: item.quantity  }  }  )
        });
        await Promise.all(promises);
        await this.cart.findByIdAndDelete(id);
    };
};