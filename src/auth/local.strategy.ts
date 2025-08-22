import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private passwordService: PasswordService, private userService: UserService) {
    super({ usernameField: 'nameUser', passwordField: 'passUser' });
  }

  async validate(nameUser: string, passUser: string): Promise<any> {
    const user = await this.userService.getUserByName(nameUser);
    if (!user || !(await this.passwordService.comparePasswords(passUser, user.passUser))) {
      throw new UnauthorizedException();
    }
    const { passUser: _, ...result } = user;
    return result
  }
}