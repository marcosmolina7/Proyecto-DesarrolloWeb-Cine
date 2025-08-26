import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from 'generated/prisma';
export declare class EmployeeService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllEmployees(): Promise<Employee[]>;
    getEmployeeById(idEmployee: number): Promise<Employee>;
    createEmployee(data: CreateEmployeeDto): Promise<Employee>;
    updateEmployee(idEmployee: number, data: UpdateEmployeeDto): Promise<Employee>;
    deleteEmployee(idEmployee: number): Promise<Employee>;
}
