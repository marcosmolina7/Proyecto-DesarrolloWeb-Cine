import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { DirectorModule } from './director/director.module';
import { GenreModule } from './genre/genre.module';
import { AgeRatingModule } from './age-rating/age-rating.module';
import { RoomModule } from './room/room.module';
import { CategorieModule } from './categorie/categorie.module';
import { SizeModule } from './size/size.module';
import { SupplierModule } from './supplier/supplier.module';
import { MovieModule } from './movie/movie.module';
import { SeatModule } from './seat/seat.module';
import { ShowtimeModule } from './showtime/showtime.module';
import { SaleModule } from './sale/sale.module';
import { TicketsModule } from './tickets/tickets.module';
import { MovieGenresModule } from './movie-genres/movie-genres.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { PdfGeneratorModule } from './pdf-generator/pdf-generator.module';
import { ProductsSaleModule } from './products-sale/products-sale.module';
import { PurchasesModule } from './purchases/purchases.module';
import { PurchasesItemsModule } from './purchases-items/purchases-items.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';

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
    ShowtimeModule,
    SaleModule,
    TicketsModule,
    MovieGenresModule,
    ProductsModule,
    ReportsModule,
    PdfGeneratorModule,
    ProductsSaleModule,
    PurchasesModule,
    PurchasesItemsModule,
    ProfileModule,
  ],
  controllers: [ProfileController],
  providers: [],
})
export class AppModule {}