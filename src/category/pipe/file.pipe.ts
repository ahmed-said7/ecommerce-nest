import { PipeTransform, ArgumentMetadata, HttpException } from '@nestjs/common';
import * as sharp from "sharp";
import {v4} from "uuid";
export class fileValidationPipe implements PipeTransform {
    async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        if( ! value ){
            return undefined;
        }
        if(! value.mimetype.startsWith('image')){
            throw new HttpException('file type should be image',400);
        };
        const filename=`category-${Date.now()}-${v4()}.jpeg`;
        await sharp(value.buffer)
            .resize(500,500).toFormat('jpeg')
            .jpeg({quality:80}).toFile(`src/uploads/category/${filename}`);
        return filename;
    };
};