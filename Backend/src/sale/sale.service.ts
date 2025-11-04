import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from 'generated/prisma';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Prisma } from 'generated/prisma'; // 1. IMPORTAR PRISMA

@Injectable()
export class SaleService {

  constructor (private prisma: PrismaService) {}

  async getAllSales(): Promise<Sale[]> {
    return this.prisma.sale.findMany({ include: { user: { select: { idUser: true, nameUser: true, idRole: true } } }, orderBy: { dateTimeSale: 'desc' }, } );
  }

  async getSaleById(idSale: number): Promise<Sale> {
    const saleFound = await this.prisma.sale.findUnique({ where: { idSale } });
    if (!saleFound) throw new NotFoundException(`Sale with ID ${idSale} does not exist.`);
    return saleFound;
  }

  async createSale(data: CreateSaleDto, idUser: number): Promise<Sale> {
    
    const user = await this.prisma.user.findUnique({ where: { idUser: idUser } });
    if (!user) throw new NotFoundException(`User with ID ${idUser} (from token) does not exist.`);

    // 2. CORRECCIÓN: Convertir el número a tipo Decimal de Prisma
    const totalAmountDecimal = new Prisma.Decimal(data.totalSale);

    return this.prisma.sale.create({ 
      data: { 
        dateTimeSale: new Date(), 
        totalAmount: totalAmountDecimal, // <-- Usamos el valor Decimal
        idUser: idUser,
      }, 
    });
  }

  async updateSale(idSale: number, data: UpdateSaleDto): Promise<Sale> {
    const saleFound = await this.prisma.sale.findUnique({ where: { idSale } });
    if (!saleFound) throw new NotFoundException(`Sale with ID ${idSale} does not exist.`);

    // 3. CORRECCIÓN: Convertir también en la actualización
    const totalAmountDecimal = data.totalSale 
      ? new Prisma.Decimal(data.totalSale)
      : undefined;

    return this.prisma.sale.update({ 
        where: { idSale }, 
        data: {
            totalAmount: totalAmountDecimal
        } 
    });
  }

  async deleteSale(idSale: number): Promise<Sale> {
    const saleFound = await this.prisma.sale.findUnique({ where: { idSale } });
    if (!saleFound) throw new NotFoundException(`Sale with ID ${idSale} does not exist.`);
    
    await this.prisma.tickets.deleteMany({ where: { idSale } });
    await this.prisma.productsSale.deleteMany({ where: { idSale } });
    
    return this.prisma.sale.delete({ where: { idSale } });
  }
}