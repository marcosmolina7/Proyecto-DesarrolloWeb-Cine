import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genre')
export class GenreController {

  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getAllGenres () {
    return this.genreService.getAllGenres();
  }

  @Get(':id')
  async getGenreById (@Param('id') id: string) {
    return this.genreService.getGenreById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createGenre (@Body() data: CreateGenreDto) {
    return this.genreService.createGenre(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateGenre (@Param('id') id: string, @Body() data: UpdateGenreDto) {
    return this.genreService.updateGenre(Number(id), data);
  }

  @Delete(':id')
  async deleteGenre (@Param('id') id: string) {
    return this.genreService.deleteGenre(Number(id));
  }

}
