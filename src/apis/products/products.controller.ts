import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { jwtAccess } from '../auth/jwt-access';
import { JwtAccessGuard } from '../auth/jwt.auth';
import { CurrentUser, ICurrentUser } from '../auth/rest.params';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';      
import {  } from "module";

@Controller('products')
export class ProductsController {
  constructor(private readonly productServie: ProductsService) {}

  // @UseGuards(JwtAccessGuard)
  @Post('create')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = await this.productServie.createProduct(createProductDto);
    return product;
  }

  @UseGuards(JwtAccessGuard)
  @Get('allProducts')
  async findProductAll() {
    const product = await this.productServie.findAllProduct();
    return product;
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  async findProductById(@Param('id') productId: string) {
    const product = await this.productServie.findProductById({ productId });
    return product;
  }
}
