import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { ProfileController } from './profile/profile.controller';
import { AdminController } from './admin/admin.controller';
import { DirectorModule } from './director/director.module';
import { GenreModule } from './genre/genre.module';


@Module({
  imports: [RoleModule, UserModule, EmployeeModule, AuthModule, DirectorModule, GenreModule],
  controllers: [ProfileController, AdminController],
  providers: [],
})
export class AppModule {}
