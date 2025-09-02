import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Supplier } from 'generated/prisma';

@Injectable()
export class SupplierService {

  constructor (private prisma: PrismaService) {}

  async getAllSuppliers (): Promise<Supplier[]> {
    return this.prisma.supplier.findMany();
  }

  async getSupplierById (idSupplier: number): Promise<Supplier> {
    const supplierFound = await this.prisma.supplier.findUnique({ where: { idSupplier } });
    if(!supplierFound) throw new NotFoundException(`Supplier with id is ${idSupplier} does not exist.`);
    return supplierFound;
  }

  async createSupplier (data: CreateSupplierDto): Promise<Supplier> {
    const existSupplier = await this.prisma.supplier.findUnique({ where: { nameSupplier: data.nameSupplier } });
    if(existSupplier) throw new ConflictException(`Supplier with name is ${data.nameSupplier} already exist.`);
    const existEmail = await this.prisma.supplier.findUnique({ where: { emailSupplier: data.emailSupplier } });
    if(existEmail) throw new ConflictException(`Supplier with email is ${data.emailSupplier} already exist.`);
    return this.prisma.supplier.create({ data });
  }

  async updateSupplier (idSupplier: number, data: UpdateSupplierDto): Promise<Supplier> {
    const supplierFound = await this.prisma.supplier.findUnique({ where: { idSupplier } });
    if(!supplierFound) throw new NotFoundException(`Supplier with id is ${idSupplier} does not exist.`);
    const existSupplier = await this.prisma.supplier.findUnique({ where: { nameSupplier: data.nameSupplier } });
    if(existSupplier) throw new ConflictException(`Supplier with name is ${data.nameSupplier} already exist.`);
    const existEmail = await this.prisma.supplier.findUnique({ where: { emailSupplier: data.emailSupplier } });
    if(existEmail) throw new ConflictException(`Supplier with email is ${data.emailSupplier} already exist.`);
    return this.prisma.supplier.update({ where: { idSupplier }, data });
  }

  async deleteSupplier (idSupplier: number): Promise<Supplier> {
    const supplierFound = await this.prisma.supplier.findUnique({ where: { idSupplier } });
    if(!supplierFound) throw new NotFoundException(`Supplier with id is ${idSupplier} does not exist.`);
    return this.prisma.supplier.delete({ where: { idSupplier } });
  }

}
