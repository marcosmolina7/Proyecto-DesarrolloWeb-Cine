import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfGeneratorModule } from 'src/pdf-generator/pdf-generator.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [PrismaModule, PdfGeneratorModule],
})
export class ReportsModule {}
