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

  @ApiBody({ required: true })
  @Post('create')
  async create(@Body() createOrder: ICreateOrder, @Res() response: Response) {
    //return this.orderService.createOrder(createOrder);
    await this.orderService.createOrder(createOrder);
    response.status(201).json({
      status: 'ok',
      statuscode: 201,
    });
  }
}
