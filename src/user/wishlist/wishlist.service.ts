import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Models } from "src/enums/models.enum";
import { UserDoc } from "../user.entity";
import { Model, ObjectId } from "mongoose";

@Injectable()
export class WishlistServices {
    constructor( 
        @InjectModel(Models.USER) private user:Model<UserDoc> ,
        @InjectModel(Models.PRODUCT) private product:Model<UserDoc>
    ){};
    addToWishlist(id:ObjectId,{_id}:UserDoc){
        this.validateProduct(id);
        const wishlist=this.user.findByIdAndUpdate(_id,
            {$addToSet :{wishlist:id} }
            ,{new:true}).select("wishlist name image").populate("wishlist");
        return { wishlist };
    };
    removeFromWishlist(id:ObjectId,{_id}:UserDoc){
        const wishlist=this.user.findByIdAndUpdate(_id,
            {$pull :{wishlist:id} }
            ,{new:true}).select("wishlist name image").populate("wishlist");
        return { wishlist };
    };
    getWishlist({_id}:UserDoc){
        const wishlist=this.user.findById(_id)
            .select("wishlist name image").populate("wishlist");
        return { wishlist };
    };
    async validateProduct(id:ObjectId){
        const product=await this.product.findById(id);
        if(!product){
            throw new HttpException('product not found',400);
        };
    };
};