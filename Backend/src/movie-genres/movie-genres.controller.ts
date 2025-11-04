import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { MovieGenresService } from './movie-genres.service';
import { CreateMovieGenreDto } from './dto/create-movie-genre.dto';
import { UpdateMovieGenreDto } from './dto/update-movie-genre.dto';

@Controller('movie-genres')
export class MovieGenresController {

  constructor(private readonly movieGenresService: MovieGenresService) {}

  @Get()
  async getAllMovieGenres () {
    return this.movieGenresService.getAllMovieGenres();
  }

  @Get(':idMovie/:idGenre')
  async getMovieGenreByIds (@Param('idMovie') idMovie: string, @Param('idGenre') idGenre: string) {
    return this.movieGenresService.getMovieGenreByIds(Number(idMovie), Number(idGenre));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createMovieGenre (@Body() data: CreateMovieGenreDto) {
    return this.movieGenresService.createMovieGenre(data);
  }

  @Put(':idMovie/:idGenre')
  @UsePipes(ValidationPipe)
  async updateMovieGenre (@Param('idMovie') idMovie: string, @Param('idGenre') idGenre: string, @Body() data: UpdateMovieGenreDto) {
    return this.movieGenresService.updateMovieGenre(Number(idMovie), Number(idGenre), data);
  }

  @Delete(':idMovie/:idGenre')
  async deleteMovieGenre (@Param('idMovie') idMovie: string, @Param('idGenre') idGenre: string) {
    return this.movieGenresService.deleteMovieGenre(Number(idMovie), Number(idGenre));
  }
}