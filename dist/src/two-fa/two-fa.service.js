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
exports.TwoFaService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const user_service_1 = require("../user/user.service");
require("dotenv/config");
const auth_service_1 = require("../auth/auth.service");
let TwoFaService = class TwoFaService {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async pipeQrCodeStream(stream, otpAuthUrl) {
        return (0, qrcode_1.toFileStream)(stream, otpAuthUrl);
    }
    async generateTwoFactorAuthenticationSecret(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpAuthUrl = otplib_1.authenticator.keyuri(user.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
        await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
        return {
            secret,
            otpAuthUrl,
        };
    }
    async isTwoFactorAuthenticationCodeValid(code, user) {
        return otplib_1.authenticator.verify({
            token: code,
            secret: user.twoFactorAuthenticationSecret,
        });
    }
};
TwoFaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], TwoFaService);
exports.TwoFaService = TwoFaService;
//# sourceMappingURL=two-fa.service.js.map