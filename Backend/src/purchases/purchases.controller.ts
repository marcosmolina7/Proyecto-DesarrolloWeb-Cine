import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Controller('purchases')
export class PurchasesController {

  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async getAllPurchases () {
    return this.purchasesService.getAllPurchases();
  }

  @Get(':id')
  async getPurchaseById (@Param('id') id: string) {
    return this.purchasesService.getPurchaseById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPurchase (@Body() data: CreatePurchaseDto) {
    return this.purchasesService.createPurchase(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updatePurchase (@Param('id') id: string, @Body() data: UpdatePurchaseDto) {
    return this.purchasesService.updatePurchase(Number(id), data);
  }

  @Delete(':id')
  async deletePurchase (@Param('id') id: string) {
    return this.purchasesService.deletePurchase(Number(id));
  }
}