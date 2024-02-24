import { PipeTransform, ArgumentMetadata, HttpException } from '@nestjs/common';
import * as sharp from "sharp";
import {v4} from "uuid";
export class fileValidationPipe implements PipeTransform {
    async transform(value: {images:Express.Multer.File[],imageCover:Express.Multer.File[]}, metadata: ArgumentMetadata) {
        if( !value.images && !value.imageCover  ){
            return {};
        };
        const obj : { images?:string[],imageCover?:string } = {};
        if( value.images){
            obj.images=[];
            const result=value.images.map((img)=>{
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
        if( value.imageCover ){
            if(!value.imageCover[0].mimetype.startsWith('image')){
                throw new HttpException('Image only supported',400);
            };
            const filename=`product-${Date.now()}-${v4()}.jpeg`;
            obj.imageCover=filename;
            await sharp(value.imageCover[0].buffer).resize(500,500).toFormat('jpeg')
                .jpeg({quality:90}).toFile(`src/uploads/product/${filename}`);
        };
        return obj;
    };
};