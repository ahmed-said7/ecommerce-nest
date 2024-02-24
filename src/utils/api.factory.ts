import mongoose, {Model,ObjectId,Query} from "mongoose";

export interface Pobulate {
    path: string;
    select: string;
};

export interface t {
    page?:string;
    sort?:string;
    select?:string;
    limit?:string;
    keyword?:string;
};


import { HttpException, Injectable } from "@nestjs/common";
import { apiFeatures,queryInterface } from "./api.features";

@Injectable()
export class apiFactory <T extends mongoose.Document> {
    constructor(){};
    async getOne( model:Model<T> , _id:ObjectId , options?: Pobulate ){
        let query=model.findOne({ _id }) as Query<T,T>;
        if ( options ) {
            query=query.populate(options) as Query<T,T>;
        };
        const data=await query;
        if(!data){
            throw new HttpException('doc not found',400);
        };
        console.log(data);
        return {data};
    };

    async deleteOne(model:Model<T>,_id:ObjectId){
        let data=await model.findById(_id);
        if(!data){
            throw new HttpException('doc not found',400);
        };
        await data.deleteOne();
        return {data};
    };

    async getAll(model:Model<T>,queryObj:queryInterface){
        const {paginationObj,query}
        =await new apiFeatures<T>( model.find() , queryObj )
            .filter()
            .sort()
            .select()
            .pagination();
        const data=await query;
        return { data , pagination:paginationObj };
    };

};