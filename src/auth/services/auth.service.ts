import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(nameUser: string, passUser: string): Promise<any> {
    const user = await this.userService.getUserByName(nameUser);
    if (user && await bcrypt.compare(passUser, user.passUser)) {
      const { passUser: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { nameUser: user.nameUser, sub: user.idUser, role: user.role.nameRole };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}