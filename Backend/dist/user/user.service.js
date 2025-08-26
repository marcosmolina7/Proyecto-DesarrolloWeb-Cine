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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const password_service_1 = require("../auth/services/password.service");
let UserService = class UserService {
    prisma;
    passwordService;
    constructor(prisma, passwordService) {
        this.prisma = prisma;
        this.passwordService = passwordService;
    }
    async getAllUsers() {
        return this.prisma.user.findMany({ include: { employee: true } });
    }
    async getUserById(idUser) {
        const userFound = await this.prisma.user.findUnique({ where: { idUser }, include: { employee: true } });
        if (!userFound)
            throw new common_1.NotFoundException(`User where id is ${idUser} does not exist.`);
        return userFound;
    }
    async createUser(data) {
        const userExist = await this.prisma.user.findUnique({ where: { nameUser: data.nameUser } });
        if (userExist)
            throw new common_1.ConflictException(`User where name is ${data.nameUser} already exist.`);
        const roleFound = await this.prisma.role.findUnique({ where: { idRole: data.idRole } });
        if (!roleFound)
            throw new common_1.NotFoundException(`Role with id is ${data.idRole} does not exits.`);
        const hashedPassword = await this.passwordService.hashPassword(data.passUser);
        data.passUser = hashedPassword;
        return this.prisma.user.create({ data });
    }
    async updateUser(idUser, data) {
        const userFound = await this.prisma.user.findUnique({ where: { idUser } });
        if (!userFound)
            throw new common_1.NotFoundException(`User with id id ${idUser} does not exist.`);
        if (data.passUser) {
            const hashedPassword = await this.passwordService.hashPassword(data.passUser);
            data.passUser = hashedPassword;
        }
        const roleFound = await this.prisma.role.findUnique({ where: { idRole: data.idRole } });
        if (!roleFound)
            throw new common_1.NotFoundException(`Role with id is ${data.idRole} does not exist`);
        return this.prisma.user.update({ where: { idUser }, data });
    }
    async deleteUser(idUser) {
        const userFound = await this.prisma.user.findUnique({ where: { idUser } });
        if (!userFound)
            throw new common_1.NotFoundException(`User with id id ${idUser} does not exist.`);
        return this.prisma.user.delete({ where: { idUser } });
    }
    async getUserByName(nameUser) {
        const nameFound = await this.prisma.user.findUnique({ where: { nameUser }, include: { role: true } });
        return nameFound;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, password_service_1.PasswordService])
], UserService);
//# sourceMappingURL=user.service.js.map