import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordService } from './services/password.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module'; // 1. AÑADIDO: Importar PrismaModule

@Module({
  imports: [
    PrismaModule, // 2. AÑADIDO: Importar PrismaModule aquí
    forwardRef(() =>UserModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' }, // 3. NOTA: 10m es muy corto, considera '60m' o '1d'
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, LocalStrategy, JwtStrategy], 
  exports: [PasswordService],
})
export class AuthModule {}