import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchases } from 'generated/prisma';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Injectable()
export class PurchasesService {
  
  constructor (private prisma: PrismaService) {}

  async getAllPurchases(): Promise<Purchases[]> {
    return this.prisma.purchases.findMany({ 
        include: { 
            user: { select: { nameUser: true, idUser: true } },
            supplier: { select: { nameSupplier: true, idSupplier: true } }
        },
        orderBy: { datePurchase: 'desc' }
    });
  }

  async getPurchaseById(idPurchase: number): Promise<Purchases> {
    const purchaseFound = await this.prisma.purchases.findUnique({ 
        where: { idPurchase },
        include: { user: true, supplier: true } // Puedes incluir más relaciones si las tienes
    });
    if (!purchaseFound) throw new NotFoundException(`Purchase with ID ${idPurchase} does not exist.`);
    return purchaseFound;
  }

  async createPurchase(data: CreatePurchaseDto): Promise<Purchases> {
    // 1. Validar que el usuario y el proveedor existan
    const userExists = await this.prisma.user.findUnique({ where: { idUser: data.idUser } });
    if (!userExists) throw new NotFoundException(`User with ID ${data.idUser} does not exist.`);
    
    const supplierExists = await this.prisma.supplier.findUnique({ where: { idSupplier: data.idSupplier } });
    if (!supplierExists) throw new NotFoundException(`Supplier with ID ${data.idSupplier} does not exist.`);

    // 2. Crear el registro de la compra
    return this.prisma.purchases.create({ data });
  }

  async updatePurchase(idPurchase: number, data: UpdatePurchaseDto): Promise<Purchases> {
    const purchaseFound = await this.prisma.purchases.findUnique({ where: { idPurchase } });
    if (!purchaseFound) throw new NotFoundException(`Purchase with ID ${idPurchase} does not exist.`);

    // Validaciones de FK (idUser, idSupplier) si se actualizan
    if (data.idUser) {
        const userExists = await this.prisma.user.findUnique({ where: { idUser: data.idUser } });
        if (!userExists) throw new NotFoundException(`User with ID ${data.idUser} does not exist.`);
    }
    if (data.idSupplier) {
        const supplierExists = await this.prisma.supplier.findUnique({ where: { idSupplier: data.idSupplier } });
        if (!supplierExists) throw new NotFoundException(`Supplier with ID ${data.idSupplier} does not exist.`);
    }

    return this.prisma.purchases.update({ where: { idPurchase }, data });
  }

  async deletePurchase(idPurchase: number): Promise<Purchases> {
    const purchaseFound = await this.prisma.purchases.findUnique({ where: { idPurchase } });
    if (!purchaseFound) throw new NotFoundException(`Purchase with ID ${idPurchase} does not exist.`);
    
    return this.prisma.purchases.delete({ where: { idPurchase } });
  }
}