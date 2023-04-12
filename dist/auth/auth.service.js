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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const jwt_1 = require("@nestjs/jwt");
const database_service_1 = require("../database/database.service");
const bcrypt = require("bcryptjs");
require('dotenv').config();
let AuthService = class AuthService {
    constructor(jwtService, databaseService) {
        this.jwtService = jwtService;
        this.databaseService = databaseService;
        this.loggerService = new common_1.Logger();
    }
    async register(user) {
        this.loggerService.log('Register User');
        try {
            user.password = await bcrypt.hash(user.password, 10);
            const userNew = await this.databaseService.user.create({
                data: Object.assign({}, user),
            });
            const payload = Object.assign({}, userNew);
            const token = this.jwtService.sign(payload);
            return { token: token };
        }
        catch (err) {
            console.log(err);
            if (err.code === '23505') {
                throw new common_1.ConflictException('Username has already been taken');
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async login(user) {
        this.loggerService.log('Login User');
        try {
            const where = {
                email: user.email,
            };
            const userOld = (await this.databaseService.user.findUnique({
                where: where,
            }));
            console.log(userOld);
            if (!userOld)
                return {
                    message: 'Email does not match',
                };
            console.log(userOld.password);
            const isValid = await bcrypt.compare(user.password, userOld.password);
            if (!isValid)
                return {
                    message: 'Password is not valid',
                };
            const { isTwoFactorAuthenticationEnabled } = userOld, dataSign = __rest(userOld, ["isTwoFactorAuthenticationEnabled"]);
            const payload = Object.assign({}, dataSign);
            const token = this.jwtService.sign(payload);
            return { token: token };
        }
        catch (e) {
            console.log(e);
            throw new common_1.InternalServerErrorException();
        }
    }
    async getAccess2FA(user) {
        try {
            const payload = Object.assign(Object.assign({}, user), { isSecondFactorAuthenticated: true });
            console.log();
            const token = this.jwtService.sign(payload, {
                secret: process.env.SERECT_JWT,
            });
            return { token };
        }
        catch (e) {
            console.log(e);
        }
    }
};
AuthService = __decorate([
    (0, decorators_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        database_service_1.DatabaseService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map