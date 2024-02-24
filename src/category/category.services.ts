import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CategoryDoc, name } from "./category.entity";
import mongoose, { Model, ObjectId } from "mongoose";
import { apiFactory } from "src/utils/api.factory";
import { queryInterface } from "src/utils/api.features";

interface CreateCategory {
    name: string;
    image: string;
};
interface UpdateCategory {
    name?: string;
    image?: string;
};


@Injectable()
export class CategoryServices {
    constructor(
        @InjectModel(name) private model:Model<CategoryDoc>,
        private api:apiFactory<CategoryDoc>
    ){};
    getAllCats(query:queryInterface){
        return this.api.getAll(this.model,query);
    };
    deleteCat(id:ObjectId){
        return this.api.deleteOne(this.model,id);
    };
    getCat(id:ObjectId){
        return this.api.getOne(this.model,id);
    };
    async createCat(body:CreateCategory){
        if(!body.image){
            throw new HttpException('image is required',400);
        };
        const cat=await this.model.create(body);
        if(! cat){
            throw new HttpException('Cannot create category',400);
        };
        return {data:cat};
    };
    async updateCat(id:ObjectId,body:UpdateCategory){
        const cat=await this.model.findByIdAndUpdate(id,body,{new : true});
        if(! cat){
            throw new HttpException('Cannot update category',400);
        };
        return {data:cat};
    };
};