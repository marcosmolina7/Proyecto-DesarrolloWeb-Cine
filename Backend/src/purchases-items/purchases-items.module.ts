import { Module } from '@nestjs/common';
import { PurchasesItemsService } from './purchases-items.service';
import { PurchasesItemsController } from './purchases-items.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PurchasesItemsController],
  providers: [PurchasesItemsService],
  imports: [PrismaModule],
})
export class PurchasesItemsModule {}
