import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {

  constructor(private prisma: PrismaService) {}

  async getAllRoles (): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async getRoleById (idRole: number): Promise<Role> {
    const roleFound = await this.prisma.role.findUnique({ where: { idRole } });
    if(!roleFound) throw new NotFoundException(`Role with id is ${idRole} does not exist.`);
    return roleFound;
  } 

  async createRole (data: CreateRoleDto): Promise<Role> {
    const existRole = await this.prisma.role.findUnique({ where: { nameRole: data.nameRole } });
    if(existRole) throw new ConflictException(`Role with name ${data.nameRole} already exist.`);
    return this.prisma.role.create({ data });
  }

  async updateRole (idRole: number, data: UpdateRoleDto): Promise<Role> {
    const roleFound = await this.prisma.role.findUnique({ where: { idRole } });
    if(!roleFound) throw new NotFoundException(`Role with id is ${idRole} does not exist.`)
    return this.prisma.role.update({ where: { idRole }, data });
  }

  async deleteRole (idRole: number): Promise<Role> {
    const roleFound = await this.prisma.role.findUnique({ where: { idRole } });
    if(!roleFound) throw new NotFoundException(`Role with id is ${idRole} does not exist.`)
    return this.prisma.role.delete({ where: { idRole } });
  }

}
