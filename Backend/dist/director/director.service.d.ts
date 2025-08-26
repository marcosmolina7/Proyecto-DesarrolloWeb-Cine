import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Director } from 'generated/prisma';
export declare class DirectorService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllDirectors(): Promise<Director[]>;
    getDirectorById(idDirector: number): Promise<Director>;
    createDirector(data: CreateDirectorDto): Promise<Director>;
    updateDirector(idDirector: number, data: UpdateDirectorDto): Promise<Director>;
    deleteDirector(idDirector: number): Promise<Director>;
}
