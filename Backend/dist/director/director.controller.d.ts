import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
export declare class DirectorController {
    private readonly directorService;
    constructor(directorService: DirectorService);
    getAllDirectors(): Promise<{
        nameDirector: string;
        idDirector: number;
    }[]>;
    getDirectorById(id: string): Promise<{
        nameDirector: string;
        idDirector: number;
    }>;
    createDirector(data: CreateDirectorDto): Promise<{
        nameDirector: string;
        idDirector: number;
    }>;
    updateDirector(id: string, data: UpdateDirectorDto): Promise<{
        nameDirector: string;
        idDirector: number;
    }>;
    deleteDirector(id: string): Promise<{
        nameDirector: string;
        idDirector: number;
    }>;
}
