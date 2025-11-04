import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePurchasesItemDto } from './dto/create-purchases-item.dto';
import { PurchasesItems } from 'generated/prisma';
import { UpdatePurchasesItemDto } from './dto/update-purchases-item.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PurchasesItemsService {
  
  constructor (private prisma: PrismaService) {}

  async getItemsByPurchaseId(idPurchase: number): Promise<PurchasesItems[]> {
    return this.prisma.purchasesItems.findMany({ 
        where: { idPurchase },
        include: { product: true },
    });
  }

  async createPurchasesItem(data: CreatePurchasesItemDto): Promise<PurchasesItems> {
    const { idProduct, idPurchase, quantity, costPrice } = data;
    
    // 1. Validaciones
    const [productFound, purchaseFound] = await Promise.all([
        this.prisma.products.findUnique({ where: { idProduct } }),
        this.prisma.purchases.findUnique({ where: { idPurchase } })
    ]);

    if (!productFound) throw new NotFoundException(`Producto con ID ${idProduct} no existe.`);
    if (!purchaseFound) throw new NotFoundException(`Compra con ID ${idPurchase} no existe.`);

    const existingItem = await this.prisma.purchasesItems.findUnique({ 
        where: { idPurchase_idProduct: { idPurchase, idProduct } } 
    });
    if (existingItem) throw new ConflictException(`Producto ID ${idProduct} ya ha sido agregado a la Compra ID ${idPurchase}.`);

    // 2. Cálculo
    const costPriceDecimal = new Decimal(costPrice);
    const subtotal = costPriceDecimal.mul(quantity);
    
    // 3. Objeto de Datos Explícito para la creación
    const purchaseItemData = {
        idProduct: idProduct,
        idPurchase: idPurchase,
        quantity: quantity,
        costPrice: costPriceDecimal, // Aseguramos que es Decimal para el modelo
        subtotal: subtotal,          // Aseguramos la inclusión del subtotal calculado
    };

    // 4. Ejecución de la Transacción
    const [purchaseItem] = await this.prisma.$transaction([
        
        // A. Crea el detalle de la compra (ITEM)
        this.prisma.purchasesItems.create({
            data: purchaseItemData, // Usamos el objeto de datos explícito
        }),
        
        // B. Actualiza el stock del producto
        this.prisma.products.update({
            where: { idProduct },
            data: {
                stockProduct: { increment: quantity }
            }
        }),
        
        // C. Actualiza el total de la compra padre
        this.prisma.purchases.update({
             where: { idPurchase },
             data: {
                 totalAmount: { increment: subtotal.toNumber() }
             }
        })
    ]);

    return purchaseItem;
  }
  
  async updatePurchasesItem(idPurchase: number, idProduct: number, data: UpdatePurchasesItemDto): Promise<PurchasesItems> {
       throw new ConflictException('La actualización manual de ítems de compra no está permitida debido a la complejidad de la gestión de stock y totales.');
  }

  async deletePurchasesItem(idPurchase: number, idProduct: number): Promise<PurchasesItems> {
       throw new ConflictException('La eliminación de ítems de compra no está permitida debido a la complejidad de la gestión de stock y totales.');
  }
}