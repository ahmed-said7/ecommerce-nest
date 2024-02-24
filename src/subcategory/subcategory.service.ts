import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { apiFactory } from "src/utils/api.factory";
import { queryInterface } from "src/utils/api.features";
import { name as catName , CategoryDoc } from "src/category/category.entity";
import { name as subName , SubcategoryDoc } from "./subcategory.entity";


interface CreateSubcategory {
    name: string;
    image?: string;
    category:ObjectId;
};
interface UpdateSubategory {
    name?: string;
    image?: string;
    category?: ObjectId;
};

@Injectable()
export class SubcategoryServices {
    constructor(
        @InjectModel(catName) private cat:Model<CategoryDoc>,
        @InjectModel(subName) private sub:Model<SubcategoryDoc>,
        private api:apiFactory<CategoryDoc>
    ){};
    getAllSubs(query:queryInterface){
        return this.api.getAll(this.sub,query);
    };
    deleteSub(id:ObjectId){
        return this.api.deleteOne(this.sub,id);
    };
    getSub(id:ObjectId){
        return this.api.getOne(this.sub,id);
    };
    async createSub(body:CreateSubcategory){
        if(!body.image){
            throw new HttpException('image is required',400);
        };
        await this.validateCategory(body.category);
        const subCat=await this.sub.create(body);
        if(! subCat){
            throw new HttpException('Cannot create subcategory',400);
        };
        return {data:subCat};
    };
    async updateSub(id:ObjectId,body:UpdateSubategory){
        if(body.category){
            await this.validateCategory(body.category);
        };
        const subCat=await this.sub.findByIdAndUpdate(id,body,{new : true});
        if(! subCat){
            throw new HttpException('Cannot update subcategory',400);
        };
        return {data:subCat};
    };
    async validateCategory(id:ObjectId){
        const cat=await this.cat.findById(id);
        if(! cat ){
            throw new HttpException('category not found',400);
        };
    }
};