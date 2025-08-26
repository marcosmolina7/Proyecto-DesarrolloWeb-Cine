import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from 'generated/prisma';

@Injectable()
export class EmployeeService {

  constructor (private prisma: PrismaService) {}

  async getAllEmployees (): Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  async getEmployeeById (idEmployee: number): Promise<Employee> {
    const employeeFound = await this.prisma.employee.findUnique({ where: { idEmployee } });
    if(!employeeFound) throw new NotFoundException(`Employee where id is ${idEmployee} does not exist.`);
    return employeeFound;
  }

  async createEmployee (data: CreateEmployeeDto): Promise<Employee> {
    const userAlreadyUse = await this.prisma.employee.findUnique({ where: { idUser: data.idUser}});
    if(userAlreadyUse) throw new ConflictException(`User with id is ${data.idUser} is already an employee.`);
    const userFound = await this.prisma.user.findUnique({ where: { idUser: data.idUser }});
    if(!userFound) throw new NotFoundException(`User with id is ${data.idUser} does not exist.`);
    return this.prisma.employee.create({ data });
  }

  async updateEmployee (idEmployee: number, data: UpdateEmployeeDto): Promise<Employee> {
    const employeeFound = await this.prisma.employee.findUnique({ where: { idEmployee } });
    if(!employeeFound) throw new NotFoundException(`Employee where id is ${idEmployee} does not exist.`);
    if (data.idUser) {
        const userAlreadyUse = await this.prisma.employee.findUnique({ where: { idUser: data.idUser } });
        if(userAlreadyUse && userAlreadyUse.idEmployee !== idEmployee) throw new ConflictException(`User with id ${data.idUser} is already associated with another employee.`);
        const userFound = await this.prisma.user.findUnique({ where: { idUser: data.idUser } });
        if(!userFound) throw new NotFoundException(`User with id ${data.idUser} does not exist.`);
    }
    return this.prisma.employee.update({ where: { idEmployee }, data });
  }

  async deleteEmployee (idEmployee: number): Promise<Employee> {
    const employeeFound = await this.prisma.employee.findUnique({ where: { idEmployee } });
    if(!employeeFound) throw new NotFoundException(`Employee where id is ${idEmployee} does not exist.`);
    return this.prisma.employee.delete({ where: { idEmployee } });
  }

}
