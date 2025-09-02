import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Director } from 'generated/prisma';

@Injectable()
export class DirectorService {

  constructor (private prisma: PrismaService) {}
  
  async getAllDirectors (): Promise<Director[]> {
    return this.prisma.director.findMany();
  }

  async getDirectorById (idDirector: number): Promise<Director> {
    const directorFound = await this.prisma.director.findUnique({ where: { idDirector } });
    if(!directorFound) throw new NotFoundException(`Director where id is ${idDirector} does not exist.`)
    return directorFound;
  }

  async createDirector (data: CreateDirectorDto): Promise<Director> {
    const existDirector = await this.prisma.director.findUnique({ where: { nameDirector: data.nameDirector } });
    if(existDirector) throw new ConflictException(`Director with name ${data.nameDirector} already exist.`);
    return this.prisma.director.create({ data });
  }

  async updateDirector (idDirector: number, data: UpdateDirectorDto): Promise<Director> {
    const directorFound = await this.prisma.director.findUnique({ where: { idDirector } });
    if(!directorFound) throw new NotFoundException(`Director where id is ${idDirector} does not exist.`);
    const existDirector = await this.prisma.director.findUnique({ where: { nameDirector: data.nameDirector } });
    if(existDirector) throw new ConflictException(`Director with name ${data.nameDirector} already exist.`);
    return this.prisma.director.update({ where: { idDirector }, data });
  }

  async deleteDirector (idDirector: number): Promise<Director> {
    const directorFound = await this.prisma.director.findUnique({ where: { idDirector } });
    if(!directorFound) throw new NotFoundException(`Director where id is ${idDirector} does not exist.`);
    return this.prisma.director.delete({ where: { idDirector } });
  }

}
