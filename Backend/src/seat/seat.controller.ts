import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('seat')
export class SeatController {

  constructor(private readonly seatService: SeatService) {}

  @Get()
  async getAllSeats () {
    return this.seatService.getAllSeats();
  }

  @Get(':id')
  async getSeatById (@Param('id') id: string) {
    return this.seatService.getSeatById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createSeat (@Body() data: CreateSeatDto) {
    return this.seatService.createSeat(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateSeat (@Param('id') id: string, @Body() data: UpdateSeatDto) {
    return this.seatService.updateSeat(Number(id), data);
  }

  @Delete(':id')
  async deleteSeat (@Param('id') id: string) {
    return this.seatService.deleteSeat(Number(id));
  }

}
