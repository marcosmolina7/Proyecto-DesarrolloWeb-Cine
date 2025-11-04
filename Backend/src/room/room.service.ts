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

  //
  // 1. ESTA ES LA FUNCIÓN CORREGIDA (createRoom)
  //
  async createRoom (data: CreateRoomDto): Promise<Room> {
    // Recibimos 'data' (que tiene nameRoom, rows, columns)
    // pero solo usamos 'nameRoom' para crear la sala en Prisma,
    // porque 'rows' y 'columns' no existen en el 'model Room'.
    const roomPayload = {
      nameRoom: data.nameRoom
    };
    
    return this.prisma.room.create({ 
      data: roomPayload // Enviamos solo el payload filtrado
    });
  }

  //
  // 2. CORRECCIÓN PROACTIVA (updateRoom)
  //    Nos aseguramos de que solo actualice 'nameRoom'.
  //
  async updateRoom (idRoom: number, data: UpdateRoomDto): Promise<Room> {
    const roomFound = await this.prisma.room.findUnique({ where: { idRoom } });
    if(!roomFound) throw new NotFoundException(`Room with id is ${idRoom} does not exist.`);
    
    return this.prisma.room.update({ 
      where: { idRoom }, 
      data: {
        nameRoom: data.nameRoom // Solo actualizamos los campos que existen
      } 
    });
  }

  //
  // 3. CORRECCIÓN PROACTIVA (deleteRoom)
  //    Debemos borrar las dependencias (RoomSeat y Showtime) primero
  //    para evitar un error de llave foránea.
  //
  async deleteRoom (idRoom: number): Promise<Room> {
    const roomFound = await this.prisma.room.findUnique({ where: { idRoom } });
    if(!roomFound) throw new NotFoundException(`Room with id is ${idRoom} does not exist.`);

    // Borrar dependencias primero
    await this.prisma.roomSeat.deleteMany({
      where: { idRoom: idRoom }
    });
    await this.prisma.showtime.deleteMany({
      where: { idRoom: idRoom }
    });
    
    // Ahora sí borrar la sala
    return this.prisma.room.delete({ where: { idRoom } });
  }

  //
  // 4. MEJORA (assignSeats)
  //    Añadimos un 'deleteMany' para que al re-asignar asientos,
  //    primero se borren los antiguos.
  //
  async assignSeats(data: AssignSeatsDto): Promise<Room> {
    const { idRoom, seats } = data;
    const roomFound = await this.prisma.room.findUnique({ where: { idRoom } });
    if (!roomFound) throw new NotFoundException(`Room with ID ${idRoom} not found.`);

    // --- MEJORA INCLUIDA ---
    // Borramos los asientos que la sala tenía antes
    await this.prisma.roomSeat.deleteMany({
      where: { idRoom: idRoom }
    });
    // --- FIN DE LA MEJORA ---

    const seatsToCreate = await Promise.all(
      seats.map(async (seatName) => {
        const rowMatch = seatName.match(/[a-zA-Z]+/);
        const columnMatch = seatName.match(/\d+/);
        if (!rowMatch || !columnMatch) throw new BadRequestException(`Invalid seat format: ${seatName}`);
        const rowSeat = rowMatch[0];
        const columnSeat = parseInt(columnMatch[0], 10);
        
        // Asumimos que el catálogo maestro de asientos SÍ existe (creado desde /admin/seats)
        const seat = await this.prisma.seat.findFirst({ where: { rowSeat, columnSeat } });
        if (!seat) throw new NotFoundException(`El asiento ${seatName} no existe en el catálogo maestro.`);
        
        return { idRoom, idSeat: seat.idSeat, state: 'disponible' };
      })
    );
    
    if (seatsToCreate.length > 0) {
      await this.prisma.roomSeat.createMany({ data: seatsToCreate, skipDuplicates: true });
    }

    const updatedRoom = await this.prisma.room.findUnique({ where: { idRoom }, include: { roomSeats: { include: { seat: true } } } });
    if (!updatedRoom) throw new NotFoundException(`Room with ID ${idRoom} not found after update.`);
    return updatedRoom;
  }
}