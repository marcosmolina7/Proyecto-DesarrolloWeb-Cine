import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';

@Controller('size')
export class SizeController {

  constructor(private readonly sizeService: SizeService) {}

  @Get()
  async getAllSizes () {
    return this.sizeService.getAllSizes();
  }

  @Get(':id')
  async getSizeById (@Param('id') id: string) {
    return this.sizeService.getSizeById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createSize (@Body() data: CreateSizeDto) {
    return this.sizeService.createSize(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateSize (@Param('id') id: string, @Body() data: UpdateSizeDto) {
    return this.sizeService.updateSize(Number(id), data);
  }

  @Delete(':id')
  async deleteSize (@Param('id') id: string) {
    return this.sizeService.deleteSize(Number(id));
  }

}
