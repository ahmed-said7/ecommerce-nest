import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { apiFactory } from "src/utils/api.factory";
import { queryInterface } from "src/utils/api.features";
import { CouponDoc } from "./coupon.entity";
import { Models } from "src/enums/models.enum";



interface CreateCoupon {
    name: string;
    expire: Date;
    discount:number;
};
interface UpdateCoupon {
    name?: string;
    expire?: Date;
    discount?: number;
};

@Injectable()
export class CouponServices {
    constructor(
        @InjectModel(Models.COUPON) private model:Model<CouponDoc>,
        private api:apiFactory<CouponDoc>
    ){};
    getAllCoupons(query:queryInterface){
        return this.api.getAll(this.model,query);
    };
    deleteCoupon(id:ObjectId){
        return this.api.deleteOne(this.model,id);
    };
    getCoupon(id:ObjectId){
        return this.api.getOne(this.model,id);
    };
    async createCoupon(body:CreateCoupon){
        await this.validateCoupon(body.name);
        const coupon=await this.model.create(body);
        if(! coupon ){
            throw new HttpException('Cannot create coupon',400);
        };
        return { coupon }; 
    };
    async updateCoupon(id:ObjectId,body:UpdateCoupon){
        if(body.name){
            await this.validateCoupon(body.name);
        };
        const coupon=await this.model.findByIdAndUpdate(id,body,{new : true});
        if(! coupon){
            throw new HttpException('Cannot update coupon',400);
        };
        return { coupon };
    };
    async validateCoupon(name:string){
        const coupon=await this.model.findOne({name});
        if( coupon ){
            throw new HttpException('coupon should be unique',400);
        };
    }
};