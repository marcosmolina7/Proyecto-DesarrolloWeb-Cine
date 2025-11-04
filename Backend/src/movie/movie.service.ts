import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Movie } from 'generated/prisma';

@Injectable()
export class MovieService {

  constructor (private prisma: PrismaService) {}

  async getAllMovies (): Promise<Movie[]> {
    // 1. AÑADIMOS 'include' aquí también para que la lista muestre todo
    return this.prisma.movie.findMany({
      include: {
        director: true,
        ageRating: true,
        movieGenres: {
          include: {
            genre: true
          }
        }
      }
    });
  }

  async getMovieById (idMovie: number): Promise<Movie> {
    const movieFound = await this.prisma.movie.findUnique({ 
      where: { idMovie },
      include: {
        director: true,
        ageRating: true,
        movieGenres: {
          include: {
            genre: true
          }
        }
      }
    });

    if(!movieFound) throw new NotFoundException(`Movie with id is ${idMovie} does not exist.`);
    return movieFound;
  }

  async createMovie (data: CreateMovieDto): Promise<Movie> {
    // Asumimos que el DTO tiene "genreIds: number[]"
    const { genreIds, ...movieData } = data as any; 

    // Usamos una transacción para asegurar que todo se cree
    return this.prisma.$transaction(async (prisma) => {
      const newMovie = await prisma.movie.create({ 
        data: {
          ...movieData
        } 
      });

      if (genreIds && genreIds.length > 0) {
        const movieGenresData = genreIds.map((idGenre: number) => ({
          idMovie: newMovie.idMovie,
          idGenre: idGenre,
        }));

        await prisma.movieGenres.createMany({
          data: movieGenresData,
        });
      }
      return newMovie;
    });
  }

  //
  // 2. FUNCIÓN 'updateMovie' CORREGIDA (¡IMPORTANTE!)
  //
  async updateMovie (idMovie: number, data: UpdateMovieDto): Promise<Movie> {
    const movieFound = await this.prisma.movie.findUnique({ where: { idMovie } });
    if(!movieFound) throw new NotFoundException(`Movie with id is ${idMovie} does not exist.`);

    const { genreIds, ...movieData } = data as any; // Separamos genreIds

    return this.prisma.$transaction(async (prisma) => {
      // 1. Actualizamos los datos planos de la película
      const updatedMovie = await prisma.movie.update({ 
        where: { idMovie }, 
        data: {
          ...movieData
        } 
      });

      // 2. Si se enviaron géneros, actualizamos las relaciones
      if (genreIds && Array.isArray(genreIds)) {
        // 2a. Borramos los géneros antiguos
        await prisma.movieGenres.deleteMany({
          where: { idMovie: idMovie }
        });

        // 2b. Creamos las nuevas relaciones de géneros
        const movieGenresData = genreIds.map((idGenre: number) => ({
          idMovie: idMovie,
          idGenre: idGenre,
        }));

        await prisma.movieGenres.createMany({
          data: movieGenresData,
        });
      }
      
      return updatedMovie;
    });
  }

  async deleteMovie (idMovie: number): Promise<Movie> {
    const movieFound = await this.prisma.movie.findUnique({ where: { idMovie } });
    if(!movieFound) throw new NotFoundException(`Movie with id is ${idMovie} does not exist.`);
    
    // Borrar dependencias primero
    await this.prisma.movieGenres.deleteMany({
      where: { idMovie: idMovie }
    });
    await this.prisma.showtime.deleteMany({
      where: { idMovie: idMovie }
    });
    // Aquí también deberías borrar 'Tickets' si están relacionados directamente a 'Movie'
    
    return this.prisma.movie.delete({ where: { idMovie } });
  }

}