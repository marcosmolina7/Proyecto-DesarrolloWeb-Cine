import { Module } from '@nestjs/common';
import { ProductsSaleService } from './products-sale.service';
import { ProductsSaleController } from './products-sale.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductsSaleController],
  providers: [ProductsSaleService],
  imports: [PrismaModule],
})
export class ProductsSaleModule {}
