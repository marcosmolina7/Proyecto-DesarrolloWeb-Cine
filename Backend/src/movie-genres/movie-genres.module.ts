import { Module } from '@nestjs/common';
import { MovieGenresService } from './movie-genres.service';
import { MovieGenresController } from './movie-genres.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MovieGenresController],
  providers: [MovieGenresService],
  imports: [PrismaModule],
})
export class MovieGenresModule {}
