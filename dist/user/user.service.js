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
const database_service_1 = require("../database/database.service");
const rxjs_1 = require("rxjs");
let UserService = class UserService {
    constructor(databaseService) {
        this.databaseService = databaseService;
        this.loggerService = new common_1.Logger();
    }
    async CreateUser(userDTO) {
        try {
            this.loggerService.log('Create User');
            const userCreate = await this.databaseService.user.create({
                data: Object.assign({}, userDTO),
            });
            const currentTime = new Date().getTime();
            return (0, rxjs_1.of)(Object.assign(Object.assign({}, userCreate), { createAt: currentTime, updateAt: currentTime }));
        }
        catch (err) { }
    }
    async setTwoFactorAuthenticationSecret(secret, user_id) {
        return this.databaseService.user.update({
            data: { twoFactorAuthenticationSecret: secret },
            where: { id: user_id },
        });
    }
    async turnOnTwoFactorAuthentication(user_id) {
        return this.databaseService.user.update({
            data: {
                isTwoFactorAuthenticationEnabled: true,
            },
            where: {
                id: user_id,
            },
        });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map