"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmployeeService = class EmployeeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllEmployees() {
        return this.prisma.employee.findMany();
    }
    async getEmployeeById(idEmployee) {
        const employeeFound = await this.prisma.employee.findUnique({ where: { idEmployee } });
        if (!employeeFound)
            throw new common_1.NotFoundException(`Employee where id is ${idEmployee} does not exist.`);
        return employeeFound;
    }
    async createEmployee(data) {
        const userAlreadyUse = await this.prisma.employee.findUnique({ where: { idUser: data.idUser } });
        if (userAlreadyUse)
            throw new common_1.ConflictException(`User with id is ${data.idUser} is already an employee.`);
        const userFound = await this.prisma.user.findUnique({ where: { idUser: data.idUser } });
        if (!userFound)
            throw new common_1.NotFoundException(`User with id is ${data.idUser} does not exist.`);
        return this.prisma.employee.create({ data });
    }
    async updateEmployee(idEmployee, data) {
        const employeeFound = await this.prisma.employee.findUnique({ where: { idEmployee } });
        if (!employeeFound)
            throw new common_1.NotFoundException(`Employee where id is ${idEmployee} does not exist.`);
        if (data.idUser) {
            const userAlreadyUse = await this.prisma.employee.findUnique({ where: { idUser: data.idUser } });
            if (userAlreadyUse && userAlreadyUse.idEmployee !== idEmployee)
                throw new common_1.ConflictException(`User with id ${data.idUser} is already associated with another employee.`);
            const userFound = await this.prisma.user.findUnique({ where: { idUser: data.idUser } });
            if (!userFound)
                throw new common_1.NotFoundException(`User with id ${data.idUser} does not exist.`);
        }
        return this.prisma.employee.update({ where: { idEmployee }, data });
    }
    async deleteEmployee(idEmployee) {
        const employeeFound = await this.prisma.employee.findUnique({ where: { idEmployee } });
        if (!employeeFound)
            throw new common_1.NotFoundException(`Employee where id is ${idEmployee} does not exist.`);
        return this.prisma.employee.delete({ where: { idEmployee } });
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map