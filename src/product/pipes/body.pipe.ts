import { PipeTransform, ArgumentMetadata, HttpException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create.dto';
import { UpdateProductDto } from '../dto/update.dto';

const fields=['quantity', 'sold', 'price', 'priceAfterDiscount',"ratingAverage",'ratingQuantity'];
export class bodyCreateProductValidationPipe implements PipeTransform {
    async transform( value: any  , metadata: ArgumentMetadata) {
        if( value.subcategories && typeof value.subcategories==="string" ){
            value.subcategories=JSON.parse(value.subcategories);
        };
        if( value.colors && typeof value.colors==="string" ){
            value.colors=JSON.parse(value.colors);
        };
        fields.forEach ((field) => {
            if( value[field] && typeof value[field] === 'string'){
                value[field]=parseInt(value[field]);
            };
        });
        console.log(value);
        return new CreateProductDto(value);
    };
};

export class bodyUpdateProductValidationPipe implements PipeTransform {
    async transform( value: any  , metadata: ArgumentMetadata) {
        if( value.subcategories && typeof value.subcategories==="string" ){
            value.subcategories=JSON.parse(value.subcategories);
        };
        if( value.colors && typeof value.colors==="string" ){
            value.colors=JSON.parse(value.colors);
        };
        fields.forEach ((field) => {
            if( value[field] && typeof value[field] === 'string'){
                value[field]=parseInt(value[field]);
            };
        });
        console.log(value);
        return new UpdateProductDto(value);
    };
};