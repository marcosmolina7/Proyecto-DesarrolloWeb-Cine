import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Movie } from 'generated/prisma';

@Injectable()
export class MovieService {

  constructor (private prisma: PrismaService) {}

  async getAllMovies (): Promise<Movie[]> {
    return this.prisma.movie.findMany();
  }

  async getMovieById (idMovie: number): Promise<Movie> {
    const movieFound = await this.prisma.movie.findUnique({ where: { idMovie } });
    if(!movieFound) throw new NotFoundException(`Movie with id is ${idMovie} does not exist.`);
    return movieFound;
  }

  async createMovie (data: CreateMovieDto): Promise<Movie> {
    return this.prisma.movie.create({ data });
  }

  async updateMovie (idMovie: number, data: UpdateMovieDto): Promise<Movie> {
    const movieFound = await this.prisma.movie.findUnique({ where: { idMovie } });
    if(!movieFound) throw new NotFoundException(`Movie with id is ${idMovie} does not exist.`);
    return this.prisma.movie.update({ where: { idMovie }, data });
  }

  async deleteMovie (idMovie: number): Promise<Movie> {
    const movieFound = await this.prisma.movie.findUnique({ where: { idMovie } });
    if(!movieFound) throw new NotFoundException(`Movie with id is ${idMovie} does not exist.`);
    return this.prisma.movie.delete({ where: { idMovie } });
  }

}

