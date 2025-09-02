import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AgeRating } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAgeRatingDto } from './dto/update-age-rating.dto';
import { CreateAgeRatingDto } from './dto/create-age-rating.dto';

@Injectable()
export class AgeRatingService {

  constructor (private prisma: PrismaService) {}

  async getAllAgeRatings (): Promise<AgeRating[]> {
    return this.prisma.ageRating.findMany();
  }

  async getAgeRatigById (idAgeRating: number): Promise<AgeRating> {
    const ageRatingFound = await this.prisma.ageRating.findUnique({ where: { idAgeRating } });
    if(!ageRatingFound) throw new NotFoundException(`Age Rating with id is ${idAgeRating} does not exist.`);
    return ageRatingFound;
  }

  async createAgeRating (data: CreateAgeRatingDto): Promise<AgeRating> {
    const existAgeRating = await this.prisma.ageRating.findUnique({ where: { nameAgeRating: data.nameAgeRating } });
    if(existAgeRating) throw new ConflictException(`Age Rating with name ${data.nameAgeRating} already exist.`);
    const existDescAgeRating = await this.prisma.ageRating.findUnique({ where: { descAgeRating: data.descAgeRating } });
    if(existDescAgeRating) throw new ConflictException(`Age Rating Desc: ${data.descAgeRating} already exist.`);
    return this.prisma.ageRating.create({ data });
  }

  async updateAgeRating (idAgeRating: number, data: UpdateAgeRatingDto): Promise<AgeRating> {
    const ageRatingFound = await this.prisma.ageRating.findUnique({ where: { idAgeRating } });
    if(!ageRatingFound) throw new NotFoundException(`Age Rating with id is ${idAgeRating} does not exist.`);
    const existAgeRating = await this.prisma.ageRating.findUnique({ where: { nameAgeRating: data.nameAgeRating } });
    if(existAgeRating) throw new ConflictException(`Age Rating with name ${data.nameAgeRating} already exist.`);
    const existDescAgeRating = await this.prisma.ageRating.findUnique({ where: { descAgeRating: data.descAgeRating } });
    if(existDescAgeRating) throw new ConflictException(`Age Rating Desc: ${data.descAgeRating} already exist.`);
    return this.prisma.ageRating.update({ where: { idAgeRating }, data });
  }

  async deleteAgeRating (idAgeRating: number): Promise<AgeRating> {
    const ageRatingFound = await this.prisma.ageRating.findUnique({ where: { idAgeRating } });
    if(!ageRatingFound) throw new NotFoundException(`Age Rating with id is ${idAgeRating} does not exist.`);
    return this.prisma.ageRating.delete({ where: { idAgeRating } });
  }

}
