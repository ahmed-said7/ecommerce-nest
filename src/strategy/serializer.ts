import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {PassportSerializer} from "@nestjs/passport";
import { Model, ObjectId } from "mongoose";
import { Models } from "src/enums/models.enum"
import { UserDoc } from "src/user/user.entity";


@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(@InjectModel(Models.USER) private userModel:Model<UserDoc> ) {
        super()
    };
    serializeUser(user: UserDoc, done: Function) {
        console.log('deserializer');
        return done(null, user._id);
    };
    async deserializeUser(payload: ObjectId, done: Function) {
        const user=await this.userModel.findById(payload);
        console.log(user);
        if(!user) return done(null, null);
        done(null, user);
    };
}; 