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
exports.TwoFaController = void 0;
const common_1 = require("@nestjs/common");
const two_fa_service_1 = require("./two-fa.service");
const user_service_1 = require("../user/user.service");
const auth_service_1 = require("../auth/auth.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TwoFaController = class TwoFaController {
    constructor(twoFactorAuthenticationService, userService, authService) {
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.userService = userService;
        this.authService = authService;
    }
    async generate(response, request) {
        const { otpAuthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
        console.log(otpAuthUrl);
        return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpAuthUrl);
    }
    async turnOnTwoFactorAuthentication(request) {
        await this.userService.turnOnTwoFactorAuthentication(request.user.id);
    }
    async authentication(request, code) {
        console.log(code);
        console.log(request.user);
        const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, request.user);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        return this.authService.getAccess2FA(request.user);
    }
};
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFaController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('turn-on'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwoFaController.prototype, "turnOnTwoFactorAuthentication", null);
__decorate([
    (0, common_1.Post)('authenticate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFaController.prototype, "authentication", null);
TwoFaController = __decorate([
    (0, common_1.Controller)('two-fa'),
    __metadata("design:paramtypes", [two_fa_service_1.TwoFaService,
        user_service_1.UserService,
        auth_service_1.AuthService])
], TwoFaController);
exports.TwoFaController = TwoFaController;
//# sourceMappingURL=two-fa.controller.js.map