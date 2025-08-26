"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const role_module_1 = require("./role/role.module");
const user_module_1 = require("./user/user.module");
const employee_module_1 = require("./employee/employee.module");
const auth_module_1 = require("./auth/auth.module");
const profile_controller_1 = require("./profile/profile.controller");
const admin_controller_1 = require("./admin/admin.controller");
const director_module_1 = require("./director/director.module");
const genre_module_1 = require("./genre/genre.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [role_module_1.RoleModule, user_module_1.UserModule, employee_module_1.EmployeeModule, auth_module_1.AuthModule, director_module_1.DirectorModule, genre_module_1.GenreModule],
        controllers: [profile_controller_1.ProfileController, admin_controller_1.AdminController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map