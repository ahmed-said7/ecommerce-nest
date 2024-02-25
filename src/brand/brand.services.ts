import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { apiFactory } from "src/utils/api.factory";
import { queryInterface } from "src/utils/api.features";
import { name,BrandDoc } from "./brand.entity";
import { Models } from "src/enums/models.enum";

interface CreateBrand {
    name: string;
    image: string;
};
interface UpdateBrand {
    name?: string;
    image?: string;
};

@Injectable()
export class BrandServices {
    constructor(
        @InjectModel(Models.BRAND) private model:Model<BrandDoc>,
        private api:apiFactory<BrandDoc>
    ){};
    getAllBrands(query:queryInterface){
        return this.api.getAll(this.model,query);
    };
    deleteBrand(id:ObjectId){
        return this.api.deleteOne(this.model,id);
    };
    getBrand(id:ObjectId){
        return this.api.getOne(this.model,id);
    };
    async createBrand(body:CreateBrand){
        if(!body.image){
            throw new HttpException('brand image not found',400);
        };
        const brand=await this.model.create(body);
        if(! brand ){
            throw new HttpException('Cannot create brand',400);
        };
        return {data:brand};
    };
    async updateBrand(id:ObjectId,body:UpdateBrand){
        const brand=await this.model.findByIdAndUpdate(id,body,{new : true});
        if(! brand){
            throw new HttpException('Cannot update brand',400);
        };
        return {data:brand};
    };
};