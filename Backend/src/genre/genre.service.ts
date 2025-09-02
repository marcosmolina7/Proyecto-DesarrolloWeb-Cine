import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Genre } from 'generated/prisma';

@Injectable()
export class GenreService {

  constructor (private prisma: PrismaService) {}

  async getAllGenres (): Promise<Genre[]> {
    return this.prisma.genre.findMany();
  }

  async getGenreById (idGenre: number): Promise<Genre> {
    const genreFound = await this.prisma.genre.findUnique({ where: { idGenre } });
    if(!genreFound) throw new NotFoundException(`Genre with id is ${idGenre} does not exist.`);
    return genreFound;
  }

  async createGenre (data: CreateGenreDto): Promise<Genre> {
    const existGenre = await this.prisma.genre.findUnique({ where: { nameGenre: data.nameGenre } });
    if(existGenre) throw new ConflictException(`Genre with name ${data.nameGenre} already exist.`);
    return this.prisma.genre.create({ data });
  }

  async updateGenre (idGenre: number, data: UpdateGenreDto): Promise<Genre> {
    const genreFound = await this.prisma.genre.findUnique({ where: { idGenre } });
    if(!genreFound) throw new NotFoundException(`Genre with id is ${idGenre} does not exist.`);
    const existGenre = await this.prisma.genre.findUnique({ where: { nameGenre: data.nameGenre } });
    if(existGenre) throw new ConflictException(`Genre with name ${data.nameGenre} already exist.`);
    return this.prisma.genre.update({ where: { idGenre }, data });
  }

  async deleteGenre (idGenre: number): Promise<Genre> {
    const genreFound = await this.prisma.genre.findUnique({ where: { idGenre } });
    if(!genreFound) throw new NotFoundException(`Genre with id is ${idGenre} does not exist.`);
    return this.prisma.genre.delete({ where: { idGenre } });
  }

}
