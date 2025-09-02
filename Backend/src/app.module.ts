import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { ProfileController } from './profile/profile.controller';
import { AdminController } from './admin/admin.controller';
import { DirectorModule } from './director/director.module';
import { GenreModule } from './genre/genre.module';
import { AgeRatingModule } from './age-rating/age-rating.module';
import { RoomModule } from './room/room.module';
import { CategorieModule } from './categorie/categorie.module';
import { SizeModule } from './size/size.module';
import { SupplierModule } from './supplier/supplier.module';
import { MovieModule } from './movie/movie.module';
import { SeatModule } from './seat/seat.module';

@Module({
  imports: [
    RoleModule, 
    UserModule, 
    EmployeeModule, 
    AuthModule, 
    DirectorModule, 
    GenreModule, 
    AgeRatingModule, 
    RoomModule, 
    CategorieModule, 
    SizeModule, 
    SupplierModule, 
    MovieModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    SeatModule,
  ],
  controllers: [ProfileController, AdminController],
  providers: [],
})
export class AppModule {}