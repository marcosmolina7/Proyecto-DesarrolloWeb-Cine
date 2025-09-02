import { Module } from '@nestjs/common';
import { AgeRatingService } from './age-rating.service';
import { AgeRatingController } from './age-rating.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AgeRatingController],
  providers: [AgeRatingService],
  imports: [PrismaModule],
})
export class AgeRatingModule {}
