import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('supplier')
export class SupplierController {

  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  async getAllSuppliers () {
    return this.supplierService.getAllSuppliers();
  }

  @Get(':id')
  async getSupplierById (@Param('id') id: string) {
    return this.supplierService.getSupplierById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createSupplier (@Body() data: CreateSupplierDto) {
    return this.supplierService.createSupplier(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateSupplier (@Param('id') id: string, @Body() data: UpdateSupplierDto) {
    return this.supplierService.updateSupplier(Number(id), data);
  }

  @Delete(':id')
  async deleteSupplier (@Param('id') id: string) {
    return this.supplierService.deleteSupplier(Number(id));
  }

}
