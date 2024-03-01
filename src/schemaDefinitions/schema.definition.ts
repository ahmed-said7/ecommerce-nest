import { Global, Injectable, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import mongoose, { Model, ObjectId, Query } from "mongoose";
import { BrandDoc, brandSchema } from "src/brand/brand.entity";
import { categorySchema,CategoryDoc } from "src/category/category.entity";
import { ProductDoc, productSchema } from "src/product/product.entity";
import { ReviewDoc, reviewSchema } from "src/reviews/reviews.entity";
import { SubcategoryDoc, subcategorySchema } from "src/subcategory/subcategory.entity";
import { UserDoc, userSchema } from "src/user/user.entity";
import * as bcrypt from "bcryptjs"
import { cartSchema } from "src/cart/cart.entity";
import { couponSchema } from "src/coupon/coupon.entity";
import { OrderDoc, orderSchema } from "src/order/order.entity";
import { InjectModel, MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models.enum";
import { ReviewModule } from "src/reviews/reviews.module";

@Injectable()
export class SchemaDefinition {
    constructor(
        // private events:EventEmitter2,
        @InjectModel(Models.PRODUCT) private prodModel:Model<ProductDoc>,
        @InjectModel(Models.REVIEW) private reviewModel:Model<ReviewDoc>,
        private config:ConfigService
        ){};
    private SetImage(doc:{image:string},file:string){
        if(doc.image){
            const image=doc.image;
            doc.image=`http://${this.config.get<string>('root_url')}/${file}/${image}`;
        };
    };
    category(){
        const self=this;
        categorySchema.post<CategoryDoc>('init',function(){
            self.SetImage(this,'category');
        });
        return categorySchema;
    };
    brand(){
        const self=this;
        brandSchema.post<BrandDoc>('init',function(){
            self.SetImage(this,'brand');
        });
        return brandSchema;
    };
    subcategory(){
        const self=this;
        subcategorySchema.pre< Query<SubcategoryDoc[]|SubcategoryDoc,SubcategoryDoc>>(/^find/ig,function(){
            this.populate({ path:"category",select:"name image -_id"  });
        });
        subcategorySchema.post<SubcategoryDoc>('init',function(){
            self.SetImage(this,'subcategory');
        });
        return subcategorySchema;
    };
    product(){
        const self=this;
        productSchema.pre<Query<ProductDoc[]|ProductDoc,ProductDoc>>(/^find/ig,function(){
            this
                .populate({ path:"brand",select:"name image -_id" })
                .populate({ path:"category",select:"name image -_id" });
        });
        function SetImage(doc:ProductDoc){
            if(doc.imageCover){
                doc.imageCover=`${self.config.get<string>('root_url')}/product/${doc.imageCover}`;
            };
            if(doc.images){
                const images = [];
                doc.images.forEach ( ( img:string ) => { 
                    images.push(`${self.config.get<string>('root_url')}/product/${img}`)
                });
                doc.images=images;
            };
        };
        productSchema.post<ProductDoc>('init',function(){
            SetImage(this);
        });
        return productSchema;
    };
    user(){
        const self = this;
        userSchema.pre('save',async function(next){
            if( this.isModified('password') ){
                this.password=await bcrypt.hash(this.password,10);
            };
            return next()
        });
        userSchema.post<UserDoc>('init',function(){
            self.SetImage(this,'user');
        });
        return userSchema;
    };
    reviews(){
        const self = this;
        reviewSchema.pre<Query<ReviewDoc[]|ReviewDoc,ReviewDoc>>(/^find/ig,function(){
            this.populate({ path:"user",select:"name image"  });
        });
        reviewSchema.post('save',function(){
            // self.events.emit('review-saved',{product:this.product});
            self.updateProduct(this.product);
        });
        reviewSchema.post("deleteOne",{document:true,query:false},function(){
            self.updateProduct(this.product);
            // self.events.emit('review-removed',{product:this.product});
        });
        return reviewSchema;
    };
    cart(){ return cartSchema};
    coupon(){ return couponSchema};
    order(){
        orderSchema.pre< Query < OrderDoc[] | OrderDoc , OrderDoc > >(/^find/,function(){
            this.populate({path:"cartItems.product",select:"title imageCover"})
            .populate({path:"user",select:"name image address"});
        });
        return orderSchema;
    };
    private async calcAvg(id:mongoose.Types.ObjectId){
        const result=await this.reviewModel.aggregate([
            { $match:{product:id} } , { 
                $group : { _id : "$product" , quantity : {$sum:1} , average : {$avg:"$rating"}     } 
            }
        ]);
        if(result.length > 0){
            return { quantity: result[0].quantity , average: result[0].average };
        }else {
            return { quantity: 0 , average: 0 };
        };
    }
    private async updateProduct(id:mongoose.Types.ObjectId){
        const {quantity:ratingQuantity,average:ratingAverage}=await this.calcAvg(id);
        await this.prodModel.
        findByIdAndUpdate( id , { ratingQuantity ,ratingAverage } , { new : true } );
    };
};

@Global()
@Module({
    imports:[
        MongooseModule.forFeatureAsync([
                {
                    name:Models.PRODUCT,
                    useFactory:function(){return productSchema}
                },
                {
                    name:Models.REVIEW,
                    useFactory:function(){return reviewSchema}
                }
            ])],
    providers:[SchemaDefinition,ConfigService],
    exports:[SchemaDefinition]
})
export class SchemaDefinitionModule {};