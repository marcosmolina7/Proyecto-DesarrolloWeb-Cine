import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieGenreDto } from './dto/create-movie-genre.dto';
import { MovieGenres } from 'generated/prisma';
import { UpdateMovieGenreDto } from './dto/update-movie-genre.dto';

@Injectable()
export class MovieGenresService {

  constructor (private prisma: PrismaService) {}

  async getAllMovieGenres(): Promise<MovieGenres[]> {
    return this.prisma.movieGenres.findMany({ include: { movie: true, genre: true }, });
  }

  async getMovieGenreByIds(idMovie: number, idGenre: number): Promise<MovieGenres> {
    const associationFound = await this.prisma.movieGenres.findUnique({
      where: { idMovie_idGenre: { idMovie, idGenre } },
      include: { movie: true, genre: true },
    });
    if (!associationFound) throw new NotFoundException(`Association between Movie ${idMovie} and Genre ${idGenre} does not exist.`);
    return associationFound;
  }

  async createMovieGenre(data: CreateMovieGenreDto): Promise<MovieGenres> {
    const { idMovie, idGenre } = data;

    if (!(await this.prisma.movie.findUnique({ where: { idMovie } }))) throw new NotFoundException(`Movie with ID ${idMovie} does not exist.`);
    if (!(await this.prisma.genre.findUnique({ where: { idGenre } }))) throw new NotFoundException(`Genre with ID ${idGenre} does not exist.`);

    const existingAssociation = await this.prisma.movieGenres.findUnique({
      where: { idMovie_idGenre: { idMovie, idGenre } },
    });

    if (existingAssociation) throw new ConflictException(`Movie ${idMovie} is already associated with Genre ${idGenre}.`);

    return this.prisma.movieGenres.create({ data: { idMovie, idGenre }, });
  }

  async updateMovieGenre(idMovie: number, idGenre: number, data: UpdateMovieGenreDto): Promise<MovieGenres> {
    throw new NotFoundException(`Update operation is not supported for MovieGenres association. Use DELETE and POST instead.`);
  }

  async deleteMovieGenre(idMovie: number, idGenre: number): Promise<MovieGenres> {
    const associationFound = await this.prisma.movieGenres.findUnique({
      where: { idMovie_idGenre: { idMovie, idGenre } },
    });
    if (!associationFound) throw new NotFoundException(`Association between Movie ${idMovie} and Genre ${idGenre} does not exist.`);
    return this.prisma.movieGenres.delete({ where: { idMovie_idGenre: { idMovie, idGenre } } });
  }
}