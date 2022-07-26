import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productServie:ProductsService
    ){}

    @Post('create')
    async createProduct(
        @Body() createProductDto:CreateProductDto
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
