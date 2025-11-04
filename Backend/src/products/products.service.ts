import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Products } from 'generated/prisma';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  
  constructor (private prisma: PrismaService) {}

  async getAllProducts(): Promise<Products[]> {
    return this.prisma.products.findMany({ include: { category: true, size: true }, orderBy: { idProduct: 'asc' }, });
  }

  async getProductById(idProduct: number): Promise<Products> {
    const productFound = await this.prisma.products.findUnique({ where: { idProduct } });
    if (!productFound) throw new NotFoundException(`Product with ID ${idProduct} does not exist.`);
    return productFound;
  }

  async createProduct(data: CreateProductDto): Promise<Products> {
    const { idCategorie, idSize, nameProduct, ...rest } = data; 

    if (!(await this.prisma.categorie.findUnique({ where: { idCategorie } }))) throw new NotFoundException(`Category with ID ${idCategorie} does not exist.`);
    if (!(await this.prisma.size.findUnique({ where: { idSize } }))) throw new NotFoundException(`Size with ID ${idSize} does not exist.`);

    
    return this.prisma.products.create({ data }); 
}

  async updateProduct(idProduct: number, data: UpdateProductDto): Promise<Products> {
    const productFound = await this.prisma.products.findUnique({ where: { idProduct } });
    if (!productFound) throw new NotFoundException(`Product with ID ${idProduct} does not exist.`);
    
    if (data.idCategorie) {
        const categorie = await this.prisma.categorie.findUnique({ where: { idCategorie: data.idCategorie } });
        if (!categorie) {
            throw new NotFoundException(`Category with ID ${data.idCategorie} does not exist.`);
        }
    }
    
    if (data.idSize) {
        const size = await this.prisma.size.findUnique({ where: { idSize: data.idSize } });
        if (!size) {
            throw new NotFoundException(`Size with ID ${data.idSize} does not exist.`);
        }
    }
    
    if (data.nameProduct) {
        const existingProduct = await this.prisma.products.findUnique({ where: { nameProduct: data.nameProduct } });
        if (existingProduct && existingProduct.idProduct !== idProduct) {
            throw new ConflictException(`Product with name '${data.nameProduct}' already exists.`);
        }
    }

    return this.prisma.products.update({ where: { idProduct }, data });
  }

  async deleteProduct(idProduct: number): Promise<Products> {
    const productFound = await this.prisma.products.findUnique({ where: { idProduct } });
    if (!productFound) throw new NotFoundException(`Product with ID ${idProduct} does not exist.`);
    return this.prisma.products.delete({ where: { idProduct } });
  }
}