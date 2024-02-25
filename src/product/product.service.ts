import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model, ObjectId } from "mongoose";
import { apiFactory } from "src/utils/api.factory";
import { queryInterface } from "src/utils/api.features";
import { name as prodName,ProductDoc} from "./product.entity";
import { name as catName , CategoryDoc } from "src/category/category.entity";
import { SubcategoryDoc , name as subName } from "src/subcategory/subcategory.entity";
import { BrandDoc,name as brandName } from "src/brand/brand.entity";
import { ReviewServices } from "src/reviews/reviews.service";
import { UserDoc } from "src/user/user.entity";
import { Models } from "src/enums/models.enum";

export interface CreateProduct {
    title: string;
    description: string;
    quantity?: number;
    sold?: number;
    price: number;
    priceAfterDiscount?: string;
    colors?: string [];
    imageCover?: string;
    images?: string [];
    category: ObjectId;
    subcategories: ObjectId [];
    brand: ObjectId;
    ratingAverage?: number;
    ratingQuantity?: number;
};
export interface UpdateProduct {
    title?: string;
    description?: string;
    quantity?: number;
    sold?: number;
    price?: number;
    priceAfterDiscount?: string;
    colors?: string [];
    imageCover?: string;
    images?: string [];
    category?: ObjectId;
    subcategories?: ObjectId [];
    brand?: ObjectId;
    ratingAverage?: number;
    ratingQuantity?: number;
};

@Injectable()
export class ProductServices {
    constructor(
        private reviewService: ReviewServices,
        @InjectModel(Models.PRODUCT) private prod:Model<ProductDoc>,
        @InjectModel(Models.SUBCATEGORY) private sub:Model<SubcategoryDoc>,
        @InjectModel(Models.CATEGOY) private cat:Model<CategoryDoc>,
        @InjectModel(Models.BRAND) private brand:Model<BrandDoc>,
        private api:apiFactory<ProductDoc>
    ){};
    async getAllProds(query:queryInterface){
        return this.api.getAll(this.prod,query);
    };
    deleteProd(id:ObjectId){
        return this.api.deleteOne(this.prod,id);
    };
    getProd(id:ObjectId){
        return this.api.getOne(this.prod,id);
    };
    async createProd(body:CreateProduct){
        if(!body.imageCover){
            throw new HttpException('imageCover is required',400);
        };
        console.log(body);
        await this.validateCategory(body.category);
        await this.validateBrand(body.brand);
        await this.validateSubcategory(body.subcategories);
        const prod=await this.prod.create(body);
        if(! prod){
            throw new HttpException('Cannot create product',400);
        };
        return {data:prod};
    };
    async updateProd(id:ObjectId,body:UpdateProduct){
        if(body.subcategories){
            await this.validateSubcategory(body.subcategories);
        };
        if(body.category){
            await this.validateCategory(body.category);
        };
        if(body.brand){
            await this.validateBrand(body.brand);
        };
        const prod=await this.prod.findByIdAndUpdate(id,body,{new : true,runValidators:true});
        if(! prod){
            throw new HttpException('Cannot update product',400);
        };
        return {data:prod};
    };
    async validateCategory(id:ObjectId){
        const cat=await this.cat.findById(id);
        if(! cat ){
            throw new HttpException('category not found',400);
        }
    };
    async validateBrand(id:ObjectId){
        const brand=await this.brand.findById(id);
        if(! brand ){
            throw new HttpException('brand not found',400);
        }
    };

    async validateSubcategory(ids:ObjectId[]){
        const subs=await this.sub.find({_id:{$in:ids}});
        if( subs.length !== ids.length ){
            throw new HttpException('subcategories not found',400);
        }
    };

    createReview(user:UserDoc,id:ObjectId,rating:number,review?:string){
        return this.reviewService.createReview({product:id,rating,review},user);
    };

    getProductReviews(id:ObjectId,query:queryInterface){
        query.product=id;
        return this.reviewService.getAllReviews(query);
    };
};