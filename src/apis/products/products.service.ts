import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto) {
    const productCreate = await this.productRepository.save({
      ...createProductDto,
    });
    console.log(productCreate);
    return productCreate;
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
