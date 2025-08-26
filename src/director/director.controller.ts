import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';

@Controller('director')
export class DirectorController {

  constructor(private readonly directorService: DirectorService) {}

  @Get()
  async getAllDirectors () {
    return this.directorService.getAllDirectors();
  }

  @Get(':id')
  async getDirectorById (@Param('id') id: string) {
    return this.directorService.getDirectorById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createDirector (@Body() data: CreateDirectorDto) {
    return this.directorService.createDirector(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateDirector (@Param('id') id: string, @Body() data: UpdateDirectorDto) {
    return this.directorService.updateDirector(Number(id), data);
  }

  @Delete(':id')
  async deleteDirector (@Param('id') id: string) {
    return this.directorService.deleteDirector(Number(id));
  }

}
