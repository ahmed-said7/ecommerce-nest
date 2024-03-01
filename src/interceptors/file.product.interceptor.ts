import { CallHandler, ExecutionContext, HttpException, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import * as sharp from "sharp";
import {v4} from "uuid";



export class FileInterceptorProductImage implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler){
        const req=context.switchToHttp().getRequest<Request>();
        const {files}=req;
        if( Array.isArray(files) ){
            return next.handle();
        };
        if( !files.images && !files.imageCover  ){
            return next.handle();
        };
        const obj : { images?:string[] , imageCover?:string } = {};
        if( files.images){
            obj.images=[];
            const result=files.images.map((img)=>{
                if(!img.mimetype.startsWith('image')){
                    throw new HttpException('Image only supported',400);
                };
                const filename=`product-${Date.now()}-${v4()}.jpeg`;
                obj.images.push(filename);
                return sharp(img.buffer).resize(500,500).toFormat('jpeg')
                .jpeg({quality:90}).toFile(`src/uploads/product/${filename}`);
            })
            await Promise.all(result);
        }
        if( files.imageCover ){
            if(!files.imageCover[0].mimetype.startsWith('image')){
                throw new HttpException('Image only supported',400);
            };
            const filename=`product-${Date.now()}-${v4()}.jpeg`;
            obj.imageCover=filename;
            await sharp(files.imageCover[0].buffer).resize(500,500).toFormat('jpeg')
                .jpeg({quality:90}).toFile(`src/uploads/product/${filename}`);
        };
        req.body.imageCover=obj.imageCover;
        req.body.images=obj.images;
        return next.handle();
    };
};