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
    private readonly orderRepository:Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>
  ){}
  async createOrder(createOrder) {
    const {createOrderDto,productId } = createOrder
    const result = await Promise.all(
      productId.map(async v => {
        const product = await this.productRepository.find({
          where:{id:v}
        })
        return product
      }) 
    )

    console.log(result)
   const order = await this.orderRepository.save({
     ...createOrderDto,
     result
   })
    
   return order
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
