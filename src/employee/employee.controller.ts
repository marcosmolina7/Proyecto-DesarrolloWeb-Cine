import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {

  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async getAllEmployees () {
    return this.employeeService.getAllEmployees();
  }

  @Get(':id')
  async getEmplooyeeById (@Param('id') id: string) {
    return this.employeeService.getEmployeeById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createEmployee (@Body() data: CreateEmployeeDto) {
    return this.employeeService.createEmployee(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateEmployee (@Param('id') id: string, @Body() data: UpdateEmployeeDto) {
    return this.employeeService.updateEmployee(Number(id), data);
  }

  @Delete(':id')
  async deleteEmployee (@Param('id') id: string) {
    return this.employeeService.deleteEmployee(Number(id));
  }

}
