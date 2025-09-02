import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Size } from 'generated/prisma';

@Injectable()
export class SizeService {

  constructor (private prisma: PrismaService) {}

  async getAllSizes (): Promise<Size[]> {
    return this.prisma.size.findMany();
  }

  async getSizeById (idSize: number): Promise<Size> {
    const sizeFound = await this.prisma.size.findUnique({ where: { idSize } });
    if(!sizeFound) throw new NotFoundException(`Size with id is ${idSize} does not exist.`);
    return sizeFound;
  }

  async createSize (data: CreateSizeDto): Promise<Size> {
    const existSize = await this.prisma.size.findUnique({ where: { nameSize: data.nameSize } });
    if(existSize) throw new ConflictException(`Size with name is ${data.nameSize} already exist.`);
    return this.prisma.size.create({ data });
  }

  async updateSize (idSize: number, data: UpdateSizeDto): Promise<Size> {
    const sizeFound = await this.prisma.size.findUnique({ where: { idSize } });
    if(!sizeFound) throw new NotFoundException(`Size with id is ${idSize} does not exist.`);
    const existSize = await this.prisma.size.findUnique({ where: { nameSize: data.nameSize } });
    if(existSize) throw new ConflictException(`Size with name is ${data.nameSize} already exist.`);
    return this.prisma.size.update({ where: { idSize }, data });
  }

  async deleteSize (idSize: number): Promise<Size> {
    const sizeFound = await this.prisma.size.findUnique({ where: { idSize } });
    if(!sizeFound) throw new NotFoundException(`Size with id is ${idSize} does not exist.`);
    return this.prisma.size.delete({ where: { idSize } });
  }

}
