import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Seat } from 'generated/prisma';

@Injectable()
export class SeatService {

  constructor (private prisma: PrismaService) {}
  
  async getAllSeats (): Promise<Seat[]> {
    return this.prisma.seat.findMany();
  }

  async getSeatById (idSeat: number): Promise<Seat> {
    const seatFound = await this.prisma.seat.findUnique({ where: { idSeat } });
    if(!seatFound) throw new NotFoundException(`Seat where id is ${idSeat} does not exist.`);
    return seatFound;
  }

  async createSeat (data: CreateSeatDto): Promise<Seat> {
    return this.prisma.seat.create({ data });
  }

  async updateSeat (idSeat: number, data: UpdateSeatDto): Promise<Seat> {
    const seatFound = await this.prisma.seat.findUnique({ where: { idSeat } });
    if(!seatFound) throw new NotFoundException(`Seat where id is ${idSeat} does not exist.`);
    return this.prisma.seat.update({ where: { idSeat }, data });
  }

  async deleteSeat (idSeat: number): Promise<Seat> {
    const seatFound = await this.prisma.seat.findUnique({ where: { idSeat } });
    if(!seatFound) throw new NotFoundException(`Seat where id is ${idSeat} does not exist.`);
    return this.prisma.seat.delete({ where: { idSeat } });
  }

}
