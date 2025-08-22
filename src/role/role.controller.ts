import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';


@Controller('role')
export class RoleController {

  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAllRoles () {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  async getRoleById (@Param('id') id: string) {
    return this.roleService.getRoleById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createRole (@Body() data: CreateRoleDto) {
    return this.roleService.createRole(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateRole (@Param('id') id: string, @Body() data: UpdateRoleDto) {
    return this.roleService.updateRole(Number(id), data);
  }

  @Delete(':id')
  async deleteRole (@Param('id') id: string) {
    return this.roleService.deleteRole(Number(id));
  }

}
