import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers () {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById (@Param('id') id: string) {
    return this.userService.getUserById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUser (@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateUser (@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(Number(id), data);
  }

  @Delete(':id')
  async deleteUser (@Param('id') id: string) {
    return this.userService.deleteUser(Number(id));
  }

}
