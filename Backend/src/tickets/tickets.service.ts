import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Tickets } from 'generated/prisma';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Prisma } from 'generated/prisma'; // 1. IMPORTAR PRISMA

@Injectable()
export class TicketsService {
  
  constructor (private prisma: PrismaService) {}

  private generateQrCode(idShowtime: number, idRoom: number, idSeat: number): string {
    return `${idShowtime}-${idRoom}-${idSeat}-${Date.now()}`;
  }

  async getAllTickets(): Promise<Tickets[]> {
    return this.prisma.tickets.findMany({ include: { showtime: { include: { movie: true, room: true } }, roomSeat: { include: { seat: true } }, user: { select: { idUser: true, nameUser: true, role: { select: { nameRole: true } } } }, sale: true }, orderBy: { idTicket: 'desc' }, });
  }

  async getTicketById(idTicket: number): Promise<Tickets> {
    const ticketFound = await this.prisma.tickets.findUnique({ where: { idTicket } });
    if (!ticketFound) throw new NotFoundException(`Ticket with ID ${idTicket} does not exist.`);
    return ticketFound;
  }

  async createTicket(data: CreateTicketDto): Promise<Tickets> {
    const { idShowtime, idRoom, idSeat, idUser, idSale, priceTicket } = data;

    // ... (Validaciones de showtime, sale, user, roomSeat... sin cambios) ...
    if (!(await this.prisma.showtime.findUnique({ where: { idShowtime } }))) throw new NotFoundException(`Showtime with ID ${idShowtime} does not exist.`);
    if (!(await this.prisma.sale.findUnique({ where: { idSale } }))) throw new NotFoundException(`Sale with ID ${idSale} does not exist.`);
    if (idUser && !(await this.prisma.user.findUnique({ where: { idUser } }))) throw new NotFoundException(`User with ID ${idUser} does not exist.`);
    const roomSeat = await this.prisma.roomSeat.findUnique({
      where: { idRoom_idSeat: { idRoom, idSeat } },
    });
    if (!roomSeat) throw new NotFoundException(`Seat ${idSeat} in Room ${idRoom} does not exist.`);
    const existingTicket = await this.prisma.tickets.findUnique({
      where: { idRoom_idSeat_idShowtime: { idRoom, idSeat, idShowtime } },
    });
    if (existingTicket) throw new ConflictException(`Seat is already reserved for this Showtime.`);
    
    
    const qrCodeTicket = this.generateQrCode(idShowtime, idRoom, idSeat);

    // 2. CORRECCIÓN: Convertir el 'priceTicket' (number) a 'Decimal'
    const priceTicketDecimal = new Prisma.Decimal(priceTicket);

    return this.prisma.tickets.create({ 
      data: { 
        priceTicket: priceTicketDecimal, // <-- Usamos el valor Decimal
        qrCodeTicket, 
        idShowtime, 
        idUser, 
        idSale, 
        idRoom, 
        idSeat 
      }, 
    });
  }

  async updateTicket(idTicket: number, data: UpdateTicketDto): Promise<Tickets> {
    const ticketFound = await this.prisma.tickets.findUnique({ where: { idTicket } });
    if (!ticketFound) throw new NotFoundException(`Ticket with ID ${idTicket} does not exist.`);
    
    // ... (Validaciones de idShowtime, idSale, idUser... sin cambios) ...
    if (data.idShowtime) {
        // ...
    }
    if (data.idSale) {
        // ...
    }
    if (data.idUser) {
        // ...
    }

    // 3. CORRECCIÓN (Opcional pero recomendado): Convertir a Decimal si se actualiza el precio
    const dataPayload: any = { ...data };
    if (data.priceTicket) {
        dataPayload.priceTicket = new Prisma.Decimal(data.priceTicket);
    }

    return this.prisma.tickets.update({ where: { idTicket }, data: dataPayload });
  }

  async deleteTicket(idTicket: number): Promise<Tickets> {
    const ticketFound = await this.prisma.tickets.findUnique({ where: { idTicket } });
    if (!ticketFound) throw new NotFoundException(`Ticket with ID ${idTicket} does not exist.`);
    return this.prisma.tickets.delete({ where: { idTicket } });
  }
}