import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts () {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  async getProductById (@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createProduct (@Body() data: CreateProductDto) {
    return this.productsService.createProduct(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateProduct (@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.updateProduct(Number(id), data);
  }

  @Delete(':id')
  async deleteProduct (@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id));
  }
}