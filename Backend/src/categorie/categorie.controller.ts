import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';

@Controller('categorie')
export class CategorieController {

  constructor(private readonly categorieService: CategorieService) {}

  @Get()
  async getAllCategories () {
    return this.categorieService.getAllCategories();
  }

  @Get(':id')
  async getCategorieById (@Param('id') id: string) {
    return this.categorieService.getCategorieById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategorie (@Body() data: CreateCategorieDto) {
    return this.categorieService.createCategorie(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateCategorie (@Param('id') id: string, @Body() data: UpdateCategorieDto) {
    return this.categorieService.updateCategorie(Number(id), data);
  }

  @Delete(':id')
  async deleteCategorie (@Param('id') id: string) {
    return this.categorieService.deleteCategorie(Number(id))
  }

}
