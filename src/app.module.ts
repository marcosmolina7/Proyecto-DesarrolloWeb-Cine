import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { ProfileController } from './profile/profile.controller';
import { AdminController } from './admin/admin.controller';


@Module({
  imports: [RoleModule, UserModule, EmployeeModule, AuthModule],
  controllers: [ProfileController, AdminController],
  providers: [],
})
export class AppModule {}
