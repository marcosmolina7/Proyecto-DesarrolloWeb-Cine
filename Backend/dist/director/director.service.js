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
exports.DirectorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DirectorService = class DirectorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllDirectors() {
        return this.prisma.director.findMany();
    }
    async getDirectorById(idDirector) {
        const directorFound = await this.prisma.director.findUnique({ where: { idDirector } });
        if (!directorFound)
            throw new common_1.NotFoundException(`Director where id is ${idDirector} does not exist.`);
        return directorFound;
    }
    async createDirector(data) {
        const existDirector = await this.prisma.director.findUnique({ where: { nameDirector: data.nameDirector } });
        if (existDirector)
            throw new common_1.ConflictException(`Director with name ${data.nameDirector} already exist.`);
        return this.prisma.director.create({ data });
    }
    async updateDirector(idDirector, data) {
        const directorFound = await this.prisma.director.findUnique({ where: { idDirector } });
        if (!directorFound)
            throw new common_1.NotFoundException(`Director where id is ${idDirector} does not exist.`);
        return this.prisma.director.update({ where: { idDirector }, data });
    }
    async deleteDirector(idDirector) {
        const directorFound = await this.prisma.director.findUnique({ where: { idDirector } });
        if (!directorFound)
            throw new common_1.NotFoundException(`Director where id is ${idDirector} does not exist.`);
        return this.prisma.director.delete({ where: { idDirector } });
    }
};
exports.DirectorService = DirectorService;
exports.DirectorService = DirectorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DirectorService);
//# sourceMappingURL=director.service.js.map