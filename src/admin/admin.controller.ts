import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('admin')
export class AdminController {

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('dashboard')
  getAdminDashboard(@Request() req) {
    return { message: `Bienvenido admin ${req.user.nameUser}` }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Casher Food')
  @Post('sales')
  createSale () {
    return { message: 'Venta creada con éxito 🚀' };
  }

}
