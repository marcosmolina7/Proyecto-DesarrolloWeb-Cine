// src/products-sale/products-sale.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put, UseGuards } from '@nestjs/common';
import { ProductsSaleService } from './products-sale.service';
import { CreateProductsSaleDto } from './dto/create-products-sale.dto';
import { UpdateProductsSaleDto } from './dto/update-products-sale.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products-sale')
export class ProductsSaleController {

  constructor(private readonly productsSaleService: ProductsSaleService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Cajero')
  async getAllProductsSale() {
    return this.productsSaleService.getAllProductsSale();
  }

  @Get(':idSale/:idProduct')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Cajero')
  async getProductSaleByIds(@Param('idSale') idSale: string, @Param('idProduct') idProduct: string) {
    return this.productsSaleService.getProductSaleByIds(Number(idSale), Number(idProduct));
  }

  // ✅ ESTE ES EL ENDPOINT QUE USA EL CHECKOUT
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Cliente', 'Admin', 'Cajero') // Clientes también pueden comprar
  @UsePipes(ValidationPipe)
  async createProductsSale(@Body() data: CreateProductsSaleDto) {
    return this.productsSaleService.createProductsSale(data);
  }

  @Put(':idSale/:idProduct')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin') // Solo admin puede actualizar
  @UsePipes(ValidationPipe)
  async updateProductsSale(
    @Param('idSale') idSale: string,
    @Param('idProduct') idProduct: string,
    @Body() data: UpdateProductsSaleDto
  ) {
    return this.productsSaleService.updateProductsSale(Number(idSale), Number(idProduct), data);
  }

  @Delete(':idSale/:idProduct')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin') // Solo admin puede eliminar
  async deleteProductsSale(@Param('idSale') idSale: string, @Param('idProduct') idProduct: string) {
    return this.productsSaleService.deleteProductsSale(Number(idSale), Number(idProduct));
  }
}
