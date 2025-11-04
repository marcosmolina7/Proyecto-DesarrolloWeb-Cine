import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {

  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async getAllTickets () {
    return this.ticketsService.getAllTickets();
  }

  @Get(':id')
  async getTicketById (@Param('id') id: string) {
    return this.ticketsService.getTicketById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTicket (@Body() data: CreateTicketDto) {
    return this.ticketsService.createTicket(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateTicket (@Param('id') id: string, @Body() data: UpdateTicketDto) {
    return this.ticketsService.updateTicket(Number(id), data);
  }

  @Delete(':id')
  async deleteTicket (@Param('id') id: string) {
    return this.ticketsService.deleteTicket(Number(id));
  }
}