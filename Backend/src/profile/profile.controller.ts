// src/profile/profile.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    // El JWT guard ya extrajo el payload y lo puso en req.user
    return {
      sub: req.user.sub,           // idUser
      nameUser: req.user.nameUser,
      idRole: req.user.idRole,
      role: req.user.role          // Nombre del rol
    };
  }
}
