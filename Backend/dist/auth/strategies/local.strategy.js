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
exports.LocalStrategy = void 0;
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/user.service");
const password_service_1 = require("../services/password.service");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    passwordService;
    userService;
    constructor(passwordService, userService) {
        super({ usernameField: 'nameUser', passwordField: 'passUser' });
        this.passwordService = passwordService;
        this.userService = userService;
    }
    async validate(nameUser, passUser) {
        const user = await this.userService.getUserByName(nameUser);
        if (!user || !(await this.passwordService.comparePasswords(passUser, user.passUser))) {
            throw new common_1.UnauthorizedException();
        }
        const { passUser: _, ...result } = user;
        return result;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [password_service_1.PasswordService, user_service_1.UserService])
], LocalStrategy);
//# sourceMappingURL=local.strategy.js.map