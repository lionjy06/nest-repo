import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { jwtAccess } from '../auth/jwt-access';
import { CurrentUser, ICurrentUser } from '../auth/rest.params';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productServie:ProductsService
    ){}

    @UseGuards(jwtAccess)
    @Post('create')
    async createProduct(
        @Body() createProductDto:CreateProductDto,
        @CurrentUser() currenUser:ICurrentUser
    ): Promise<Product>{
        const product = await this.productServie.createProduct(createProductDto)
        return product
    }

    @Get('allProducts')
    async findProductAll(){
    const product = await this.productServie.findAllProduct()
    return product
    }



    @Get(':id')
    async findProductById(
        @Param('id') productId:string){
        const product = await this.productServie.findProductById({productId})
        return product
    }

   
}
