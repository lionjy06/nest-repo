import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { jwtAccess } from '../auth/jwt-access';
import { JwtAccessGuard } from '../auth/jwt.auth';
import { CurrentUser, ICurrentUser } from '../auth/rest.params';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import {} from 'module';

import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';

@ApiTags('product')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productServie: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: Object,
    required: true,
    description: '상품 등록을 위한 api',
  })
  @Post('create')
  async createProduct(
    @Res() response: Response,
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    try {
      const product = await this.productServie.createProduct({
        createProductDto,
        currentUser,
      });
      return response.status(201).json({
        statusCode: 201,
        status: 'ok',
        result: product,
      });
    } catch (e) {
      return response.status(400).json({
        status: 'fail',
        statusCode: 400,
        message: e,
      });
    }
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
