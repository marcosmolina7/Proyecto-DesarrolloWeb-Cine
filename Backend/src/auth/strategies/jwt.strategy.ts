import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // token en header Authorization
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // clave secreta
    });
  }

  async validate(payload: any) {
    // aquí retornas lo que estará en req.user
    return { 
      userId: payload.sub, 
      nameUser: payload.nameUser, 
      role: payload.role 
    };
  }
}
