import { Global, Injectable, Module} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import mongoose, { Schema } from "mongoose";
import { Query } from "mongoose";

export const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true
    },
    image:String,
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
},{ timestamps: true }
);

export interface SubcategoryDoc extends mongoose.Document {
    name:string;
    image:string;
    category:mongoose.Types.ObjectId;
};

@Injectable()
export class InitializedSubcategorySchema {
    subcategory:Schema;
    constructor(private config:ConfigService){
        const self=this;
        subcategorySchema.pre< Query<SubcategoryDoc[]|SubcategoryDoc,SubcategoryDoc>>(/^find/ig,function(){
            this.populate({ path:"category",select:"name image -_id"  });
        });
        subcategorySchema.post<SubcategoryDoc>('init',function(doc){
            if(doc.image){
                const image=doc.image;
                doc.image=`${self.config.get<string>('root_url')}/subcategory/${image}`;
            }
        });
        this.subcategory=subcategorySchema;
    };
};

@Global()
@Module({providers:[InitializedSubcategorySchema],exports:[InitializedSubcategorySchema]})
export class InitializedSubcategorySchemaModule{};
export const name='Subcategory';