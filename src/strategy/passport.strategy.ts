import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { UserDoc } from 'src/user/user.entity';
import { Model } from 'mongoose';
import { Models } from 'src/enums/models.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor( config:ConfigService,
        @InjectModel(Models.USER) private userModel:Model<UserDoc> ) {
        super({
            clientID:config.get<string>('client_id'),
            clientSecret: config.get<string>('client_secret'),
            callbackURL: 'http://localhost:5000/google/redirect',
            scope: ['email', 'profile'],
        });
    }
    async validate(access:string,refresh:string,profile:any ){
        const { name, email,picture:image } = profile._json;
        const googleAuth=true;
        let user=await this.userModel.findOne({email});
        if(user){
            return user;
        }
        user=await this.userModel.create({name,email,image,googleAuth});
        return user;
    }
}