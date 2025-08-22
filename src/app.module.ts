import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [RoleModule, UserModule, EmployeeModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
