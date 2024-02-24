import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { queryInterface } from "src/user/user.service";
import { ObjectId } from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";
import { CouponServices } from "./coupon.service";
import { UpdateCouponDto } from "./dto/update.dto";
import { CreateCouponDto } from "./dto/create.dto";


@Controller('coupon')
export class CouponController {
    constructor(private couponService: CouponServices){};
    @Get(":id")
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getCoupon( @Param('id') id:ObjectId ){
        return this.couponService.getCoupon(id);
    };

    @Get()
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getCoupons(@Query() query : queryInterface ){
        return this.couponService.getAllCoupons(query)
    };
    
    @Patch(':id')
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    updateCoupon(
        @Param('id') id:ObjectId,
        @Body() body:UpdateCouponDto
        ){
        return this.couponService.updateCoupon(id,body);
    };
    
    @Delete(":id")
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    deleteCoupon(@Param('id') id:ObjectId){
        return this.couponService.deleteCoupon(id);
    };

    @Post()
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    createCoupon(@Body() body:CreateCouponDto){
        return this.couponService.createCoupon(body);
    };
};