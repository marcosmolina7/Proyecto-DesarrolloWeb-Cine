  import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; // ⬅️ Añadido BadRequestException
  import { PrismaService } from 'src/prisma/prisma.service';
  import { Showtime } from 'generated/prisma';
  // ... (tus otros imports)
  import { CreateShowtimeDto } from './dto/create-showtime.dto';
  import { UpdateShowtimeDto } from './dto/update-showtime.dto'; // ⬅️ Añadido UpdateShowtimeDto

  @Injectable()
  export class ShowtimeService {
    
  // ... (código existente ... )
    constructor (private prisma: PrismaService) {}

    async getAllShowtimes (): Promise<Showtime[]> {
  // ... (código existente ... )
      return this.prisma.showtime.findMany({ include: { room: true, movie: true, }, orderBy: { dateTimeShowtime: 'asc', }, } );
    }

    async getShowtimeById (idShowtime: number): Promise<Showtime> {
  // ... (código existente ... )
      const showtimeFound = await this.prisma.showtime.findUnique({ where: { idShowtime } });
      if(!showtimeFound) throw new NotFoundException(`Showtime with id is ${idShowtime} does not exist.`);
  // ... (código existente ... )
      return showtimeFound;
    }

    async createShowtime (data: CreateShowtimeDto): Promise<Showtime> {
  // ... (código existente ... )
      const movie = await this.prisma.movie.findUnique({ where: { idMovie: data.idMovie } });
      if(!movie) throw new NotFoundException(`Movie with ID ${data.idMovie} does not exist.`);
  // ... (código existente ... )
      const room = await this.prisma.room.findUnique({ where: { idRoom: data.idRoom } });
      if(!room) throw new NotFoundException(`Room with ID ${data.idRoom} does not exist.`);

  // ... (código existente ... )
      return this.prisma.showtime.create({ data: { dateTimeShowtime: new Date(data.dateTimeShowtime), idRoom: data.idRoom, idMovie: data.idMovie, }, } );
    }

    async updateShowtime (idShowtime: number, data: UpdateShowtimeDto): Promise<Showtime> { // ⬅️ Usamos UpdateShowtimeDto
      const showtimeFound = await this.prisma.showtime.findUnique({ where: { idShowtime } });
  // ... (código existente ... )
      if(!showtimeFound) throw new NotFoundException(`Showtime with id is ${idShowtime} does not exist.`);

      if (data.idMovie) {
  // ... (código existente ... )
          const movie = await this.prisma.movie.findUnique({ where: { idMovie: data.idMovie } });
          if(!movie) throw new NotFoundException(`Movie with ID ${data.idMovie} does not exist.`);
  // ... (código existente ... )
      }
      if (data.idRoom) {
          const room = await this.prisma.room.findUnique({ where: { idRoom: data.idRoom } });
  // ... (código existente ... )
          if(!room) throw new NotFoundException(`Room with ID ${data.idRoom} does not exist.`);
      }
      
  // ... (código existente ... )
      return this.prisma.showtime.update({ where: { idShowtime }, data });
    }

    async deleteShowtime (idShowtime: number): Promise<Showtime> {
  // ... (código existente ... )
      const showtimeFound = await this.prisma.showtime.findUnique({ where: { idShowtime } });
      if(!showtimeFound) throw new NotFoundException(`Showtime with id is ${idShowtime} does not exist.`);
  // ... (código existente ... )
      return this.prisma.showtime.delete({ where: { idShowtime } });
    }

    //
    // ⬇️ 1. AÑADE ESTA NUEVA FUNCIÓN COMPLETA ⬇️
    //    (Esta es la que necesita tu frontend)
    //
    async getShowtimesByMovieId(idMovie: number): Promise<Showtime[]> {
      return this.prisma.showtime.findMany({
        where: { 
          idMovie: idMovie,
          // Filtramos solo funciones de hoy en adelante
          dateTimeShowtime: {
            gte: new Date() 
          }
        },
        include: {
          room: { // Incluimos la sala
            include: {
              roomSeats: { // Incluimos los asientos de esa sala
                include: {
                  seat: true, // Incluimos los detalles de cada asiento (A1, A2...)
                },
              },
            },
          },
          tickets: true, // Incluimos los tickets ya vendidos para esta función
        },
        orderBy: {
          dateTimeShowtime: 'asc', // Ordenar por fecha
        },
      });
    }

  }