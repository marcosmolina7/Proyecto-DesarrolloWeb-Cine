import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DirectorController],
  providers: [DirectorService],
  imports: [PrismaModule],

})
export class DirectorModule {}
