import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { apiFactory } from "src/utils/api.factory";
import { queryInterface } from "src/utils/api.features";
import { ReviewDoc,name as reviewName } from "./reviews.entity";
import { ProductDoc,name } from "src/product/product.entity";
import { UserDoc } from "src/user/user.entity";
import { OnEvent } from '@nestjs/event-emitter';
interface CreateReview {
    review?: string;
    rating: number;
    user?:ObjectId;
    product:ObjectId;
};
interface UpdateReview {
    review?: string;
    rating?: number;
    user?:ObjectId;
    product?:ObjectId;
};

@Injectable()
export class ReviewServices {
    constructor(
        @InjectModel(reviewName) private model:Model<ReviewDoc>,
        private api:apiFactory<ReviewDoc>,
        @InjectModel(name) private prod:Model<ProductDoc>,
    ){};
    getAllReviews(query:queryInterface){
        return this.api.getAll(this.model,query);
    };
    async deleteReview(id:ObjectId,user:UserDoc){
        await this.accessReview(user,id);
        return this.api.deleteOne(this.model,id);
    };
    getReview(id:ObjectId){
        return this.api.getOne(this.model,id);
    };
    async createReview(body:CreateReview,user:UserDoc){
        await this.validateProduct(body.product);
        body.user = user._id;
        const review=await this.model.create(body);
        if(! review ){
            throw new HttpException('Cannot create review',400);
        };
        return {data:review};
    };
    async updateReview(id:ObjectId,body:UpdateReview,user:UserDoc){
        if(body.product){
            this.validateProduct(body.product);
        };
        await this.accessReview(user,id);
        const review=await this.model.findByIdAndUpdate(id,body,{new : true});
        if(! review){
            throw new HttpException('Cannot update review',400);
        };
        await review.save();
        return {data:review};
    };
    private async validateProduct(id:ObjectId){
        const product=await this.prod.findById(id);
        if(!product){
            throw new HttpException('Product not found',400);
        }
    };
    private async accessReview(user:UserDoc,id:ObjectId){
        if( user.role === 'admin' ) return true;
        const review=await this.api.getOne(this.model,id);
        //@ts-ignore
        if( review.data.user._id.toString() === user._id.toString() ) return true;
        throw new HttpException('you are not allowed to access review',400);
    }
    private async calcAvg(id:ObjectId){
        const result=await this.model.aggregate([
            { $match:{product:id} } , { 
                $group : { _id : "$product" , quantity : {$sum:1} , average : {$avg:"$rating"}     } 
            }
        ]);
        if(result.length > 0){
            return { quantity: result[0].quantity , average: result[0].average };
        }else {
            return { quantity: 0 , average: 0 };
        };
    }
    private async updateProduct(id:ObjectId){
        const {quantity:ratingQuantity,average:ratingAverage}=await this.calcAvg(id);
        await this.prod.findByIdAndUpdate( id , { ratingQuantity ,ratingAverage } , { new : true } );
    };
    @OnEvent('review-saved')
    async handleReviewSaved(obj:{product:ObjectId}){
        this.updateProduct(obj.product);
    };
    @OnEvent('review-removed')
    async handleReviewRemoved(obj:{product:ObjectId}){
        this.updateProduct(obj.product);
    };
};