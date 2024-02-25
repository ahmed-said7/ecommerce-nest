import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Models } from "src/enums/models.enum";
import { UserDoc } from "../user.entity";
import { Model, ObjectId } from "mongoose";

interface createAddress {
    street:string,
    postalCode?:string,
    phone:string,
    city:string,
    details?:string
};



@Injectable()
export class AddressServices {
    constructor( 
        @InjectModel(Models.USER) private user:Model<UserDoc> 
    ){};
    addAddress(body:createAddress,{_id}:UserDoc){
        const address=this.user.findByIdAndUpdate(_id,
            { $addToSet :{ address : body } },
            {new:true}).select('address');
        return { address };
    };
    removeAddress(addressId:ObjectId,user:UserDoc){
        const address=this.user.findByIdAndUpdate(user._id,
            { $pull : { _id:addressId } },
            {new:true}).select('address');
        return { address };
    };
    getAddress(user:UserDoc){
        const address=this.user.findById(user._id).select('address');
        return { address };
    };
};