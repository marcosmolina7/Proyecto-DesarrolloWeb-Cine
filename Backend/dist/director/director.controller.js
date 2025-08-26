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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectorController = void 0;
const common_1 = require("@nestjs/common");
const director_service_1 = require("./director.service");
const create_director_dto_1 = require("./dto/create-director.dto");
const update_director_dto_1 = require("./dto/update-director.dto");
let DirectorController = class DirectorController {
    directorService;
    constructor(directorService) {
        this.directorService = directorService;
    }
    async getAllDirectors() {
        return this.directorService.getAllDirectors();
    }
    async getDirectorById(id) {
        return this.directorService.getDirectorById(Number(id));
    }
    async createDirector(data) {
        return this.directorService.createDirector(data);
    }
    async updateDirector(id, data) {
        return this.directorService.updateDirector(Number(id), data);
    }
    async deleteDirector(id) {
        return this.directorService.deleteDirector(Number(id));
    }
};
exports.DirectorController = DirectorController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DirectorController.prototype, "getAllDirectors", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DirectorController.prototype, "getDirectorById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_director_dto_1.CreateDirectorDto]),
    __metadata("design:returntype", Promise)
], DirectorController.prototype, "createDirector", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_director_dto_1.UpdateDirectorDto]),
    __metadata("design:returntype", Promise)
], DirectorController.prototype, "updateDirector", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DirectorController.prototype, "deleteDirector", null);
exports.DirectorController = DirectorController = __decorate([
    (0, common_1.Controller)('director'),
    __metadata("design:paramtypes", [director_service_1.DirectorService])
], DirectorController);
//# sourceMappingURL=director.controller.js.map