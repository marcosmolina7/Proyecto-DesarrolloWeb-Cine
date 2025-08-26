import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenreController {
    private readonly genreService;
    constructor(genreService: GenreService);
    getAllGenres(): Promise<{
        nameGenre: string;
        idGenre: number;
    }[]>;
    getGenreById(id: string): Promise<{
        nameGenre: string;
        idGenre: number;
    }>;
    createGenre(data: CreateGenreDto): Promise<{
        nameGenre: string;
        idGenre: number;
    }>;
    updateGenre(id: string, data: UpdateGenreDto): Promise<{
        nameGenre: string;
        idGenre: number;
    }>;
    deleteGenre(id: string): Promise<{
        nameGenre: string;
        idGenre: number;
    }>;
}
