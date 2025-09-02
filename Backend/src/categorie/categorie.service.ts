import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Categorie } from 'generated/prisma';

@Injectable()
export class CategorieService {

  constructor (private prisma: PrismaService) {}

  async getAllCategories (): Promise<Categorie[]> {
    return this.prisma.categorie.findMany();
  }

  async getCategorieById (idCategorie: number): Promise<Categorie> {
    const categorieFound = await this.prisma.categorie.findUnique({ where: { idCategorie } });
    if(!categorieFound) throw new NotFoundException(`Categorie with id is ${idCategorie} does not exist.`);
    return categorieFound;
  }

  async createCategorie (data: CreateCategorieDto): Promise<Categorie> {
    const existCategorie = await this.prisma.categorie.findUnique({ where: { nameCategorie: data.nameCategorie } });
    if(existCategorie) throw new ConflictException(`Categorie with name is ${data.nameCategorie} already exist.`);
    return this.prisma.categorie.create({ data });
  }

  async updateCategorie (idCategorie: number, data: UpdateCategorieDto): Promise<Categorie> {
    const categorieFound = await this.prisma.categorie.findUnique({ where: { idCategorie } });
    if(!categorieFound) throw new NotFoundException(`Categorie with id is ${idCategorie} does not exist.`);
    const existCategorie = await this.prisma.categorie.findUnique({ where: { nameCategorie: data.nameCategorie } });
    if(existCategorie) throw new ConflictException(`Categorie with name is ${data.nameCategorie} already exist.`);
    return this.prisma.categorie.update({ where: { idCategorie }, data });
  }

  async deleteCategorie (idCategorie: number): Promise<Categorie> {
    const categorieFound = await this.prisma.categorie.findUnique({ where: { idCategorie } });
    if(!categorieFound) throw new NotFoundException(`Categorie with id is ${idCategorie} does not exist.`);
    return this.prisma.categorie.delete({ where: { idCategorie } });
  }

}
