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
exports.GenreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GenreService = class GenreService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllGenres() {
        return this.prisma.genre.findMany();
    }
    async getGenreById(idGenre) {
        const genreFound = await this.prisma.genre.findUnique({ where: { idGenre } });
        if (!genreFound)
            throw new common_1.NotFoundException(`Genre with id is ${idGenre} does not exist.`);
        return genreFound;
    }
    async createGenre(data) {
        const existGenre = await this.prisma.genre.findUnique({ where: { nameGenre: data.nameGenre } });
        if (existGenre)
            throw new common_1.ConflictException(`Genre with name ${data.nameGenre} already exist.`);
        return this.prisma.genre.create({ data });
    }
    async updateGenre(idGenre, data) {
        const genreFound = await this.prisma.genre.findUnique({ where: { idGenre } });
        if (!genreFound)
            throw new common_1.NotFoundException(`Genre with id is ${idGenre} does not exist.`);
        return this.prisma.genre.update({ where: { idGenre }, data });
    }
    async deleteGenre(idGenre) {
        const genreFound = await this.prisma.genre.findUnique({ where: { idGenre } });
        if (!genreFound)
            throw new common_1.NotFoundException(`Genre with id is ${idGenre} does not exist.`);
        return this.prisma.genre.delete({ where: { idGenre } });
    }
};
exports.GenreService = GenreService;
exports.GenreService = GenreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GenreService);
//# sourceMappingURL=genre.service.js.map