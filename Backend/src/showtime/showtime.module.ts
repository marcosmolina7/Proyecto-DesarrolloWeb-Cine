import { Module } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
  imports: [PrismaModule],
})
export class ShowtimeModule {}
