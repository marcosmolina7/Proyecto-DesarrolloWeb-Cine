import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CategorieController } from './categorie.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CategorieController],
  providers: [CategorieService],
  imports: [PrismaModule],
})
export class CategorieModule {}
