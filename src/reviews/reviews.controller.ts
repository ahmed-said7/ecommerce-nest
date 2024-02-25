import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { queryInterface } from "src/user/admin-features/user.service";
import { ObjectId } from "mongoose";
import { UpdateReviewDto } from "./dto/create.dto";
import { Roles } from "src/decorator/roles.decorator";
import { AuthorizationGuard } from "src/guards/user.guard";
import { CreateReviewDto } from "./dto/update.dto";
import { ReviewServices } from "./reviews.service";
import { User } from "src/decorator/user.decorator";
import { UserDoc } from "src/user/user.entity";



@Controller('review')
export class ReviewController {
    constructor(private reviewService: ReviewServices){};
    @Get(":id")
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getReview( @Param('id') id:ObjectId ){
        return this.reviewService.getReview(id);
    };

    @Get()
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getReviews(@Query() query : queryInterface ){
        return this.reviewService.getAllReviews(query);
    };
    
    @Patch(':id')
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    updateBrand(
        @Param('id') id:ObjectId,
        @Body() body:UpdateReviewDto,
        @User() user:UserDoc
        ){
        return this.reviewService.updateReview(id,body,user);
    };
    
    @Delete(":id")
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    deleteBrand(@Param('id') id:ObjectId,@User() user:UserDoc){
        return this.reviewService.deleteReview(id,user);
    };

    @Post()
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    createBrand(@Body() body:CreateReviewDto,@User() user:UserDoc){
        return this.reviewService.createReview(body,user);
    };
};