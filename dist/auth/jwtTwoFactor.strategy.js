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
exports.JwtTwoFactorStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
require("dotenv/config");
const database_service_1 = require("../database/database.service");
let JwtTwoFactorStrategy = class JwtTwoFactorStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-two-factor') {
    constructor(databaseService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SERECT_JWT,
            ignoreExpiration: true,
        });
        this.databaseService = databaseService;
    }
    async validate({ email, isTwoFactorAuthenticationEnabled }) {
        console.log({ isTwoFactorAuthenticationEnabled, email });
        const user = await this.databaseService.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new common_1.HttpException('Invalid token', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (user.isTwoFactorAuthenticationEnabled &&
            !isTwoFactorAuthenticationEnabled) {
            throw new common_1.HttpException('Permission denied', common_1.HttpStatus.FORBIDDEN);
        }
        return user;
    }
};
JwtTwoFactorStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], JwtTwoFactorStrategy);
exports.JwtTwoFactorStrategy = JwtTwoFactorStrategy;
//# sourceMappingURL=jwtTwoFactor.strategy.js.map