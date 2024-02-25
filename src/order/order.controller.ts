import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { OrderServices } from "./order.service";
import { CreateOrderDto } from "./dto/create.dto";
import { User } from "src/decorator/user.decorator";
import { UserDoc } from "src/user/user.entity";
import { Request } from "express";
import { AuthorizationGuard } from "src/guards/user.guard";
import { Roles } from "src/decorator/roles.decorator";
import { ObjectId } from "mongoose";
import { queryInterface } from "src/utils/api.features";


@Controller()
export class OrderController {
    constructor(private orderService: OrderServices){};
    
    @Post('cashOrder')
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    createCashOrder( @Body() body:CreateOrderDto , @User() user:UserDoc  ){
        return this.orderService.createCashOrder(user,body);
    };
    
    @Patch('/update-paid/:id')
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    updatePaidOrder( @Param('id') id:ObjectId ){
        return this.orderService.updatePaidOrder(id);
    };
    
    @Patch('update-delivered/:id')
    @Roles(['admin', 'manager'])
    @UseGuards(AuthorizationGuard)
    updateDeliveredOrder( @Param('id') id:ObjectId ){
        return this.orderService.updateDeliveredOrder(id);
    };
    
    @Get('')
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getOrders( @Query() query:queryInterface ){
        return this.orderService.getAllOrders(query);
    };
    
    @Get(':id')
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getOrder( @Param('id') id:ObjectId ){
        return this.orderService.findOne(id);
    };
    
    @Get('session')
    @Roles(['admin', 'manager','user'])
    @UseGuards(AuthorizationGuard)
    getSession ( @User() user:UserDoc, @Req() req:Request  ){
        return this.orderService.checkoutSession(user,req);
    };

    @Post('webhook')
    webhook ( @Req() req:Request  ){
        return this.orderService.webhookCheckout(req);
    };

};
