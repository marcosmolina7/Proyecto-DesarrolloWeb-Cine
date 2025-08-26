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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RoleService = class RoleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllRoles() {
        return this.prisma.role.findMany();
    }
    async getRoleById(idRole) {
        const roleFound = await this.prisma.role.findUnique({ where: { idRole } });
        if (!roleFound)
            throw new common_1.NotFoundException(`Role with id is ${idRole} does not exist.`);
        return roleFound;
    }
    async createRole(data) {
        const existRole = await this.prisma.role.findUnique({ where: { nameRole: data.nameRole } });
        if (existRole)
            throw new common_1.ConflictException(`Role with name ${data.nameRole} already exist.`);
        return this.prisma.role.create({ data });
    }
    async updateRole(idRole, data) {
        const roleFound = await this.prisma.role.findUnique({ where: { idRole } });
        if (!roleFound)
            throw new common_1.NotFoundException(`Role with id is ${idRole} does not exist.`);
        return this.prisma.role.update({ where: { idRole }, data });
    }
    async deleteRole(idRole) {
        const roleFound = await this.prisma.role.findUnique({ where: { idRole } });
        if (!roleFound)
            throw new common_1.NotFoundException(`Role with id is ${idRole} does not exist.`);
        return this.prisma.role.delete({ where: { idRole } });
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoleService);
//# sourceMappingURL=role.service.js.map