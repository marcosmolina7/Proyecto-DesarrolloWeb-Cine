import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room } from 'generated/prisma';
import { AssignSeatsDto } from './dto/assign-seats.dto';

@Injectable()
export class RoomService {

  constructor (private prisma: PrismaService) {}

  async getAllRooms (): Promise<Room[]> {
    return this.prisma.room.findMany();
  }

  async getRoomById (idRoom: number): Promise<Room> {
    const roomFound = await this.prisma.room.findUnique({  where: { idRoom }, include: { roomSeats: { include: { seat: true } } } });
    if(!roomFound) throw new NotFoundException(`Room with id is ${idRoom} does not exist.`);
    return roomFound;
  }

  async createRoom (data: CreateRoomDto): Promise<Room> {
    return this.prisma.room.create({ data });
  }

  async updateRoom (idRoom: number, data: UpdateRoomDto): Promise<Room> {
    const roomFound = await this.prisma.room.findUnique({ where: { idRoom } });
    if(!roomFound) throw new NotFoundException(`Room with id is ${idRoom} does not exist.`);
    return this.prisma.room.update({ where: { idRoom }, data });
  }

  async deleteRoom (idRoom: number): Promise<Room> {
    const roomFound = await this.prisma.room.findUnique({ where: { idRoom } });
    if(!roomFound) throw new NotFoundException(`Room with id is ${idRoom} does not exist.`);
    return this.prisma.room.delete({ where: { idRoom } });
  }

  async assignSeats(data: AssignSeatsDto): Promise<Room> {
    const { idRoom, seats } = data;
    const roomFound = await this.prisma.room.findUnique({ where: { idRoom } });
    if (!roomFound) throw new NotFoundException(`Room with ID ${idRoom} not found.`);

    const seatsToCreate = await Promise.all(
      seats.map(async (seatName) => {
        const rowMatch = seatName.match(/[a-zA-Z]+/);
        const columnMatch = seatName.match(/\d+/);
        if (!rowMatch || !columnMatch) throw new BadRequestException(`Invalid seat format: ${seatName}`);
        const rowSeat = rowMatch[0];
        const columnSeat = parseInt(columnMatch[0], 10);
        const seat = await this.prisma.seat.findFirst({ where: { rowSeat, columnSeat } });
        if (!seat) throw new NotFoundException(`Seat ${seatName} not found.`);
        return { idRoom, idSeat: seat.idSeat, state: 'disponible' };
      })
    );
    
    await this.prisma.roomSeat.createMany({ data: seatsToCreate, skipDuplicates: true });

    const updatedRoom = await this.prisma.room.findUnique({ where: { idRoom }, include: { roomSeats: { include: { seat: true } } } });
    if (!updatedRoom) throw new NotFoundException(`Room with ID ${idRoom} not found after update.`);
    return updatedRoom;
  }
}