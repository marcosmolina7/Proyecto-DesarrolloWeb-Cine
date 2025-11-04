import { Controller, Post, Request, UseGuards, Body, UsePipes, ValidationPipe, Get } from '@nestjs/common'; 
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { RegisterAuthDto } from '../dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // ✅ NUEVO ENDPOINT: Obtener perfil del usuario autenticado
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('📍 Usuario del request:', req.user); // ✅ LOG PARA DEBUG
    return {
      sub: req.user.sub,
      nameUser: req.user.nameUser,
      idRole: req.user.idRole,
      role: req.user.role,
    };
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }
}