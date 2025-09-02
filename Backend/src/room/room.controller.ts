import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AssignSeatsDto } from './dto/assign-seats.dto';

@Controller('room')
export class RoomController {

  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getAllRooms () {
    return this.roomService.getAllRooms();
  }

  @Get(':id')
  async getRoomById (@Param('id') id: string) {
    return this.roomService.getRoomById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createRoom (@Body() data: CreateRoomDto) {
    return this.roomService.createRoom(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateRoom (@Param('id') id: string, @Body() data: UpdateRoomDto) {
    return this.roomService.updateRoom(Number(id), data);
  }

  @Delete(':id')
  async deleteRoom (@Param('id') id: string) {
    return this.roomService.deleteRoom(Number(id));
  }

  @Post('assign-seats')
    @UsePipes(ValidationPipe)
    async assignSeats(@Body() data: AssignSeatsDto) {
      return this.roomService.assignSeats(data);
    }

}
