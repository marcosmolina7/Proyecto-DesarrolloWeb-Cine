import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from 'src/auth/services/password.service';


@Injectable()
export class UserService {

  constructor(private prisma: PrismaService, private passwordService: PasswordService) {}

  async getAllUsers (): Promise<User[]> {
    return this.prisma.user.findMany({ include: { employee: true } });
  }

  async getUserById (idUser: number): Promise<User> {
    const userFound = await this.prisma.user.findUnique({ where: { idUser }, include: { employee: true } });
    if(!userFound) throw new NotFoundException(`User where id is ${idUser} does not exist.`);
    return userFound;
  }

  async registerUser (data: CreateUserDto): Promise<User> {
    const userExist = await this.prisma.user.findUnique({ where: { nameUser: data.nameUser } });
    if(userExist) throw new ConflictException(`User where name is ${data.nameUser} already exist.`);
    const roleFound = await this.prisma.role.findUnique({ where: { idRole: data.idRole } });
    if(!roleFound) throw new NotFoundException(`Role with id is ${data.idRole} does not exits.`);
    const hashedPassword = await this.passwordService.hashPassword(data.passUser);
    data.passUser = hashedPassword;
    return this.prisma.user.create({ data });
  }

  async updateUser (idUser: number, data: UpdateUserDto): Promise<User> {
    const userFound = await this.prisma.user.findUnique({ where: { idUser } });
    if(!userFound) throw new NotFoundException(`User with id id ${idUser} does not exist.`);
    if(data.passUser) {
      const hashedPassword = await this.passwordService.hashPassword(data.passUser);
      data.passUser = hashedPassword;
    }
    const roleFound = await this.prisma.role.findUnique({ where: { idRole: data.idRole } });
    if(!roleFound) throw new NotFoundException(`Role with id is ${data.idRole} does not exist`);
    return this.prisma.user.update({ where: { idUser }, data });
  }

  async deleteUser (idUser: number): Promise<User> {
    const userFound = await this.prisma.user.findUnique({ where: { idUser } });
    if(!userFound) throw new NotFoundException(`User with id id ${idUser} does not exist.`);
    return this.prisma.user.delete({ where: { idUser } });
  }

  async getUserByName (nameUser: string): Promise<User | null> {
    const nameFound = await this.prisma.user.findUnique({ where: { nameUser }, include: { role: true } });
    return nameFound;
  }

}
