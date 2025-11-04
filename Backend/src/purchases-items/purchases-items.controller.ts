import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { PurchasesItemsService } from './purchases-items.service';
import { CreatePurchasesItemDto } from './dto/create-purchases-item.dto';

@Controller('purchases-items')
export class PurchasesItemsController {

  constructor(private readonly purchasesItemsService: PurchasesItemsService) {}

  @Get(':idPurchase')
  async getItemsByPurchaseId (@Param('idPurchase') idPurchase: string) {
    return this.purchasesItemsService.getItemsByPurchaseId(Number(idPurchase));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPurchasesItem (@Body() data: CreatePurchasesItemDto) {
    return this.purchasesItemsService.createPurchasesItem(data);
  }
}