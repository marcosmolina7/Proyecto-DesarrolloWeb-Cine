// src/products-sale/products-sale.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductsSaleDto } from './dto/create-products-sale.dto';
import { UpdateProductsSaleDto } from './dto/update-products-sale.dto';
import { ProductsSale } from 'generated/prisma';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductsSaleService {
  
  constructor(private prisma: PrismaService) {}

  async getAllProductsSale(): Promise<ProductsSale[]> {
    return this.prisma.productsSale.findMany({
      include: {
        sale: true,
        product: {
          include: {
            category: true,
            size: true,
          },
        },
      },
    });
  }

  async getProductSaleByIds(idSale: number, idProduct: number): Promise<ProductsSale> {
    const productSaleFound = await this.prisma.productsSale.findUnique({
      where: {
        idSale_idProduct: {
          idSale,
          idProduct,
        },
      },
      include: {
        sale: true,
        product: true,
      },
    });

    if (!productSaleFound) {
      throw new NotFoundException(
        `ProductSale with idSale=${idSale} and idProduct=${idProduct} does not exist.`
      );
    }

    return productSaleFound;
  }

  async createProductsSale(data: CreateProductsSaleDto): Promise<ProductsSale> {
    const { idSale, idProduct, quantity, unitPrice } = data;

    // 1. Validar que la venta existe
    const sale = await this.prisma.sale.findUnique({ where: { idSale } });
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${idSale} does not exist.`);
    }

    // 2. Validar que el producto existe
    const product = await this.prisma.products.findUnique({ where: { idProduct } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${idProduct} does not exist.`);
    }

    // 3. Validar stock disponible
    if (product.stockProduct < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product "${product.nameProduct}". Available: ${product.stockProduct}, Requested: ${quantity}`
      );
    }

    // 4. Convertir unitPrice a Decimal
    const unitPriceDecimal = new Prisma.Decimal(unitPrice);

    // 5. Crear el registro de venta de producto
    const productSale = await this.prisma.productsSale.create({
      data: {
        idSale,
        idProduct,
        quantity,
        unitPrice: unitPriceDecimal,
      },
    });

    // 6. ✅ IMPORTANTE: Actualizar el stock del producto (restar cantidad vendida)
    await this.prisma.products.update({
      where: { idProduct },
      data: {
        stockProduct: {
          decrement: quantity,
        },
      },
    });

    return productSale;
  }

  async updateProductsSale(
    idSale: number,
    idProduct: number,
    data: UpdateProductsSaleDto
  ): Promise<ProductsSale> {
    // Verificar que existe
    const productSaleFound = await this.prisma.productsSale.findUnique({
      where: {
        idSale_idProduct: {
          idSale,
          idProduct,
        },
      },
    });

    if (!productSaleFound) {
      throw new NotFoundException(
        `ProductSale with idSale=${idSale} and idProduct=${idProduct} does not exist.`
      );
    }

    // Si se actualiza la cantidad, ajustar el stock
    if (data.quantity && data.quantity !== productSaleFound.quantity) {
      const product = await this.prisma.products.findUnique({ where: { idProduct } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${idProduct} does not exist.`);
      }

      const difference = data.quantity - productSaleFound.quantity;

      // Validar que hay stock suficiente si se aumenta la cantidad
      if (difference > 0 && product.stockProduct < difference) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${product.stockProduct}, Additional needed: ${difference}`
        );
      }

      // Actualizar stock
      await this.prisma.products.update({
        where: { idProduct },
        data: {
          stockProduct: {
            increment: -difference, // Si difference es positivo, resta; si es negativo, suma
          },
        },
      });
    }

    // Convertir unitPrice si existe
    const dataPayload: any = { ...data };
    if (data.unitPrice) {
      dataPayload.unitPrice = new Prisma.Decimal(data.unitPrice);
    }

    return this.prisma.productsSale.update({
      where: {
        idSale_idProduct: {
          idSale,
          idProduct,
        },
      },
      data: dataPayload,
    });
  }

  async deleteProductsSale(idSale: number, idProduct: number): Promise<ProductsSale> {
    const productSaleFound = await this.prisma.productsSale.findUnique({
      where: {
        idSale_idProduct: {
          idSale,
          idProduct,
        },
      },
    });

    if (!productSaleFound) {
      throw new NotFoundException(
        `ProductSale with idSale=${idSale} and idProduct=${idProduct} does not exist.`
      );
    }

    // ✅ IMPORTANTE: Devolver el stock al inventario antes de eliminar
    await this.prisma.products.update({
      where: { idProduct },
      data: {
        stockProduct: {
          increment: productSaleFound.quantity,
        },
      },
    });

    return this.prisma.productsSale.delete({
      where: {
        idSale_idProduct: {
          idSale,
          idProduct,
        },
      },
    });
  }
}