import { Injectable } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICurrentUser } from '../auth/rest.params';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from './entities/product.entity';

export interface ICreateProduct{
  createProductDto:CreateProductDto,
  currentUser:ICurrentUser
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  
  async createProduct({createProductDto,currentUser}:ICreateProduct) {
    // const productCreate = this.productRepository.create({createProductDto,user})
    const user = await this.userRepository.findOne({where:{id:currentUser.id}})
    const res =  await this.productRepository.save({
      ...createProductDto,
      user})
    return res
  }

  
  async findProductById({ productId }) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    return product;
  }

  async findAllProduct() {
    const product = await this.productRepository.find();
    return product;
  }
}
