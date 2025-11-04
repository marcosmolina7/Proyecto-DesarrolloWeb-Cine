import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put, UseGuards, Request } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('sale')
export class SaleController {

  constructor(private readonly saleService: SaleService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin') 
  async getAllSales () {
    return this.saleService.getAllSales();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin') 
  async getSaleById (@Param('id') id: string) {
    return this.saleService.getSaleById(Number(id));
  }

  //
  // 1. CORRECCIÓN: Este es el endpoint que usará el CLIENTE
  //
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('Cliente', 'Admin', 'Cajero') // Asegúrate de que 'Cliente' esté escrito igual que en tu BD
  @UsePipes(ValidationPipe)
  async createSale (
    @Body() data: CreateSaleDto,
    @Request() req: any 
  ) {
    // 2. CORRECCIÓN: Cambiamos 'req.user.idUser' por 'req.user.sub'
    //    'sub' (subject) es el ID del usuario guardado en el token JWT.
    const idUserFromToken = req.user.sub; 
    
    return this.saleService.createSale(data, idUserFromToken);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin') 
  @UsePipes(ValidationPipe)
  async updateSale (@Param('id') id: string, @Body() data: UpdateSaleDto) {
    return this.saleService.updateSale(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin') 
  async deleteSale (@Param('id') id: string) {
    return this.saleService.deleteSale(Number(id));
  }
}