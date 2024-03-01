import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response } from "express";
import { Error } from "mongoose";

interface MongoError {
    driver?:boolean;
    code?:number;  
    name?:string;
    statusCode?:number;
    status?:string;
    errmsg:string;
    index?:string;
};

interface ServerError {message?:string, code?:number};

@Catch()
export class catchExceptionsFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        const object:ServerError={};
        object.code=400;
        console.log(exception);
        const res=host.switchToHttp().getResponse<Response>();
        if( exception?.response?.message && Array.isArray(exception.response.message)){
            this.handleNestError(exception.response,object);
        }else if( exception instanceof HttpException) {
            this.handleHttpException(exception,object);
        }else if ( exception.name === "ValidationError" ){
            this.handleMongoValidatioError(exception,object);
        }else if(exception.name === "CastError"){
            this.handleCastError(exception,object);
        }else if(exception.code === 11000){
            this.handleDuplicationError(exception,object);
        }else if(exception.name === 'JsonWebTokenError'){
            this.invalidJwt(object);
        }else if (exception.name === 'TokenExpiredError'){
            this.handleJwtExpired(object);
        }else{
            this.internalError(object);
        };
        res.status(object.code).json(object);
    };
    handleDuplicationError(exception:MongoError,object:ServerError){
        const val= exception.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
            object.message=` duplicate value of ${ val } `;
    };
    handleMongoValidatioError(exception:Error.ValidationError,object:ServerError){
        object.message=Object
            .values(exception.errors)
            .map( ( Err : Error.ValidatorError ) => Err.message ).join(' and ');
    };
    handleCastError(exception:Error.CastError,object:ServerError){
        object.message=`invalid mongoId value ${exception.value}`;
    };
    handleNestError
    (exception:{message:string[],statusCode:number},object:ServerError){
        object.message=exception.message.join(' and ');
        object.code=exception.statusCode;
    };
    handleHttpException(exception:HttpException,object:ServerError){
        object.message=exception.message;
        object.code=exception.getStatus();
    };
    internalError(object:ServerError){
        object.message=`internal server error`;
        object.code=500;
    };
    handleJwtExpired(object:ServerError){
        object.message='json web token expired , please login again';
    };
    invalidJwt(object:ServerError){
        object.message='json web token is invalid';
    };
};