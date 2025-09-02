import { Module } from '@nestjs/common';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SizeController],
  providers: [SizeService],
  imports: [PrismaModule],
})
export class SizeModule {}
