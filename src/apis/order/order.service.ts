import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async createOrder(createOrder) {
    const { createOrderDto, productId } = createOrder;
    const productArr = await Promise.all(
      productId.map(async (v) => {
        const result = await this.productRepository.find({
          where: { id: v },
        });
        return result;
      }),
    );
    const result = [];
    productArr.forEach((ele) => {
      result.push(ele[0]);
    });
    const order = await this.orderRepository.save({
      ...createOrderDto,
      product: result,
    });
    console.log(`order:${order}`);
    return order;
  }
}
