import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    getAllEmployees(): Promise<{
        idUser: number;
        namesEmployee: string;
        lastNamesEmployee: string;
        phoneEmployee: string;
        birthdayEmployee: Date;
        stateEmployee: boolean;
        idEmployee: number;
    }[]>;
    getEmplooyeeById(id: string): Promise<{
        idUser: number;
        namesEmployee: string;
        lastNamesEmployee: string;
        phoneEmployee: string;
        birthdayEmployee: Date;
        stateEmployee: boolean;
        idEmployee: number;
    }>;
    createEmployee(data: CreateEmployeeDto): Promise<{
        idUser: number;
        namesEmployee: string;
        lastNamesEmployee: string;
        phoneEmployee: string;
        birthdayEmployee: Date;
        stateEmployee: boolean;
        idEmployee: number;
    }>;
    updateEmployee(id: string, data: UpdateEmployeeDto): Promise<{
        idUser: number;
        namesEmployee: string;
        lastNamesEmployee: string;
        phoneEmployee: string;
        birthdayEmployee: Date;
        stateEmployee: boolean;
        idEmployee: number;
    }>;
    deleteEmployee(id: string): Promise<{
        idUser: number;
        namesEmployee: string;
        lastNamesEmployee: string;
        phoneEmployee: string;
        birthdayEmployee: Date;
        stateEmployee: boolean;
        idEmployee: number;
    }>;
}
