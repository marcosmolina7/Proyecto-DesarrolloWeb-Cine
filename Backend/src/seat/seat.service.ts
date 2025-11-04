import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Seat } from 'generated/prisma';
import { CreateBulkSeatsDto } from './dto/create-bulk-seats.dto';

// Helper para convertir 0 -> 'A', 1 -> 'B', etc.
const getRowLabel = (index: number): string => {
  return String.fromCharCode(65 + index); // 65 es el código ASCII de 'A'
};

@Injectable()
export class SeatService {

  constructor (private prisma: PrismaService) {}
  
  async getAllSeats (): Promise<Seat[]> {
    return this.prisma.seat.findMany({
      orderBy: [
        { rowSeat: 'asc' },
        { columnSeat: 'asc' },
      ]
    });
  }

  async getSeatById (idSeat: number): Promise<Seat> {
    const seatFound = await this.prisma.seat.findUnique({ where: { idSeat } });
    if(!seatFound) throw new NotFoundException(`Seat where id is ${idSeat} does not exist.`);
    return seatFound;
  }

  async createSeat (data: CreateSeatDto): Promise<Seat> {
    return this.prisma.seat.create({ data });
  }

  //
  // 2. FUNCIÓN PARA CREACIÓN MASIVA
  //
  async createBulkSeats (data: CreateBulkSeatsDto): Promise<{ count: number }> {
    const { rows, columns } = data;
    
    // 1. CORRECCIÓN: Definimos el tipo explícitamente para evitar el error 'never'.
    // Usamos $Prisma.SeatCreateManyInput para coincidir con lo que 'createMany' espera.
    const seatsToCreate: { rowSeat: string; columnSeat: number; }[] = []; 

    for (let r = 0; r < rows; r++) {
      const rowSeat = getRowLabel(r); // A, B, C...
      for (let c = 1; c <= columns; c++) {
        const columnSeat = c; // 1, 2, 3...
        seatsToCreate.push({
          rowSeat,
          columnSeat,
        });
      }
    }

    // Usamos createMany con skipDuplicates para ignorar asientos que ya existan (ej. 'A1')
    const result = await this.prisma.seat.createMany({
      data: seatsToCreate,
      skipDuplicates: true,
    });

    return result; // Devuelve un objeto { count: X } con el número de asientos creados
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