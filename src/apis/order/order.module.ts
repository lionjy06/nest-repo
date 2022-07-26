import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports:[
    TypeOrmModule.forFeature([Order,Product])
  ]
})
export class OrderModule {}
