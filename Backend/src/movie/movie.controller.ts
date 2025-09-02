import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { diskStorage } from 'multer';

@Controller('movie')
export class MovieController {

  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getAllMovies () {
    return this.movieService.getAllMovies();
  }

  @Get(':id')
  async getMovieById (@Param('id') id: string) {
    return this.movieService.getMovieById(Number(id));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { // 'file' debe ser el nombre del campo en el formulario
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
          cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        },
      }),
    }),
  )
  async createMovie (@UploadedFile() file: Express.Multer.File, @Body('data') data: string) {
    if (!file) {
        throw new BadRequestException('Image file is required.');
    }

    const movieData: CreateMovieDto = JSON.parse(data); 
    
    movieData.posterMovie = file.path;

    return this.movieService.createMovie(movieData);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateMovie (@Param('id') id: string, @Body() data: UpdateMovieDto) {
    return this.movieService.updateMovie(Number(id), data);
  }

  @Delete(':id')
  async deleteMovie (@Param('id') id: string) {
    return this.movieService.deleteMovie(Number(id));
  }

}