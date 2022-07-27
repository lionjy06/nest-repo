import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

interface ICreateOrder {
  createOrderDto: CreateOrderDto;
  productId: string[];
}

@ApiTags('order')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBody({ required: true })
  @Post('create')
  create(@Body() createOrder: ICreateOrder) {
    return this.orderService.createOrder(createOrder);
  }
}
