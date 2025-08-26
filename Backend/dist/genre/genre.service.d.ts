import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Genre } from 'generated/prisma';
export declare class GenreService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllGenres(): Promise<Genre[]>;
    getGenreById(idGenre: number): Promise<Genre>;
    createGenre(data: CreateGenreDto): Promise<Genre>;
    updateGenre(idGenre: number, data: UpdateGenreDto): Promise<Genre>;
    deleteGenre(idGenre: number): Promise<Genre>;
}
