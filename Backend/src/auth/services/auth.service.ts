import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service'; 
import { PrismaService } from 'src/prisma/prisma.service'; 
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    private jwtService: JwtService,
    private prisma: PrismaService,         
  ) {}

  async validateUser(nameUser: string, passUser: string): Promise<any> {
    const user = await this.userService.getUserByName(nameUser);
    
    if (user && await bcrypt.compare(passUser, user.passUser)) {
      const { passUser: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      nameUser: user.nameUser, 
      sub: user.idUser,
      idRole: user.idRole,           
      role: user.role.nameRole 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterAuthDto) {
    const { nameUser, passUser } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { nameUser },
    });
    if (existingUser) {
      throw new ConflictException('Ese nombre de usuario ya existe.');
    }

    const idRoleCliente = 4;

    const userToCreate: CreateUserDto = {
      nameUser,
      passUser: passUser,
      idRole: idRoleCliente,
    };

    const user = await this.userService.registerUser(userToCreate); 

    const { passUser: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}