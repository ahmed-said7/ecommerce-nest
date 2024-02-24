import { Injectable } from "@nestjs/common";
import { Query } from "mongoose";

export interface queryInterface {
    [key:string] : string|object ;
    page?:string;
    sort?:string;
    select?:string;
    limit?:string;
    keyword?:string;
};
export interface Pagination {
    currentPage?:number;
    previousPage?:number;
    nextPage?:number;
    numOfDocs?:number;
    skip?:number;
    limit?:number;
};


export class apiFeatures< T > {
    public paginationObj:Pagination={};
    constructor( public query:Query< T[] , T > , public queryObj:queryInterface ){};
    filter(obj?:object){
        let filter={ ... this.queryObj , ...  obj };
        let fields : ('keyword'|'page'|'limit'|'select'|'sort')[]=['keyword','page','limit','select','sort'];
        fields.forEach( (field  ) => { delete filter[field] } );
        let queryStr=JSON.stringify(filter);
        queryStr=queryStr.replace( /lt|gt|lte|gte/g , val => `$${val}` );
        filter=JSON.parse(queryStr);
        this.query=this.query.find({ ... filter });
        return this;
    };
    sort(){
        if(this.queryObj.sort){
            const sort= this.queryObj.sort.split(',').join(' ');
            this.query=this.query.sort(sort);
        };
        return this;
    };
    select(){
        if(this.queryObj.select){
            const select= this.queryObj.select.split(',').join(' ');
            this.query=this.query.select(select);
        };
        return this;
    };
    search(){
        if(this.queryObj.keyword){
            const keyword=this.queryObj.keyword;
            this.query=this.query.find({ $text : { $search : keyword } })
        };
        return this;
    };
    async pagination(){
        this.paginationObj.numOfDocs= (await (this.query.model.find({ ... this.query.getQuery() }))).length;
        this.paginationObj.currentPage=this.queryObj.page ? parseInt( this.queryObj.page ) : 1 ;
        this.paginationObj.limit=this.queryObj.limit ? parseInt(this.queryObj.limit) : 10 ;
        this.paginationObj.skip= ( this.paginationObj.currentPage - 1 ) * this.paginationObj.limit ;
        if( this.paginationObj.currentPage > 1){
            this.paginationObj.previousPage=this.paginationObj.currentPage - 1;
        };
        if( this.paginationObj.numOfDocs > this.paginationObj.currentPage * this.paginationObj.limit ){
            this.paginationObj.nextPage=this.paginationObj.currentPage+1;
        };
        this.query=this.query.skip(this.paginationObj.skip).limit(this.paginationObj.limit);
        return this;
    };
};