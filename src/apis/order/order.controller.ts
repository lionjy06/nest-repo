import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Response, response } from 'express';

interface ICreateOrder {
  createOrderDto: CreateOrderDto;
  productId: string[];
}

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBody({ required: true, type:Object })
  @Post('create')
  async create(@Body() createOrder: ICreateOrder, @Res() response: Response) {
    try{
    await this.orderService.createOrder(createOrder);
    return response.status(201).json({
      status: 'ok',
      statuscode: 201,
    });
    } catch(e){
      return response.status(400).json({
        message:e,
        status:400
      })
    }
  }
}
