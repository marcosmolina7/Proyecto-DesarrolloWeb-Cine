import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SaleController],
  providers: [SaleService],
  imports: [PrismaModule],
})
export class SaleModule {}
