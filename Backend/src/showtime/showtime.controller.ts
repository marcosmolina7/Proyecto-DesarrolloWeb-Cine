import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtime')
export class ShowtimeController {

  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get()
  async getAllShowtimes () {
    return this.showtimeService.getAllShowtimes();
  }

  @Get(':id')
  async getShowtimeById (@Param('id') id: string) {
    return this.showtimeService.getShowtimeById(Number(id));
  }

  //
  // ⬇️ 1. ENDPOINT AÑADIDO ⬇️
  //    (Esta es la ruta que tu frontend estaba buscando)
  //
  @Get('movie/:id')
  async getShowtimesByMovieId(@Param('id') id: string) {
    return this.showtimeService.getShowtimesByMovieId(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createShowtime (@Body() data: CreateShowtimeDto) {
    return this.showtimeService.createShowtime(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateShowtime (@Param('id') id: string, @Body() data: UpdateShowtimeDto) {
    return this.showtimeService.updateShowtime(Number(id), data);
  }

  @Delete(':id')
  async deleteShowtime (@Param('id') id: string) {
    return this.showtimeService.deleteShowtime(Number(id));
  }
}