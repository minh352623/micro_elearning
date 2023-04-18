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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./user.dto");
const user_service_1 = require("./user.service");
const rxjs_1 = require("rxjs");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const config_store_1 = require("../../utils/config-store");
const cloudinary_service_1 = require("../cloundinay/cloudinary.service");
let UserController = class UserController {
    constructor(userService, cloudinaryService) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
    }
    async createUser(avatar, userDTO) {
        try {
            const avatarFile = await this.cloudinaryService.uploadImage(avatar);
            if (avatarFile && avatarFile.url) {
                userDTO.avatar = avatarFile.url;
            }
            return (await this.userService.CreateUser(userDTO)).pipe((0, rxjs_1.map)((data) => {
                return {
                    msg: 'Create user successfully',
                    data: Object.assign(Object.assign({}, data), { createAt: Number(data.createAt), updateAt: Number(data.updateAt) }),
                };
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
    async createManyUser(fileUsers) {
        try {
            return this.userService.createManyUser(fileUsers);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getProfile(req) {
        return req.user;
    }
    async updateUser(id, userDTO) {
        try {
            return (await this.userService.UpdateUser(id, userDTO)).pipe((0, rxjs_1.map)((data) => {
                return {
                    msg: 'Update user successfully',
                    data: Object.assign({}, data),
                };
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
    async forgotPassword(req) {
        try {
            return this.userService.forgotPassword(req.user);
        }
        catch (err) {
            console.log(err);
        }
    }
    deleteUserById(id) {
        try {
            return this.userService.Delete(id).pipe((0, rxjs_1.map)((data) => {
                const user = __rest(data, []);
                return {
                    msg: 'Delete user successfully',
                    data: Object.assign(Object.assign({}, user), { createAt: Number(data.createdAt), updateAt: Number(data.updatedAt) }),
                };
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
    async getPaginaion(limit = 10, page = 1, search = undefined, order_by = 'desc') {
        try {
            const countUser = await this.userService.countUser();
            return this.userService.GetAllUser(limit, page, search, order_by).pipe((0, rxjs_1.map)((data) => {
                return {
                    totalRow: countUser,
                    msg: 'Get all user successfully',
                    data: data.map((e) => {
                        const { deleted } = e, user = __rest(e, ["deleted"]);
                        return Object.assign(Object.assign({}, user), { createAt: Number(e.createdAt), updateAt: Number(e.updatedAt) });
                    }),
                };
            }));
        }
        catch (err) {
            throw err;
        }
    }
    async getAllGroupOfUser(id) {
        try {
            return this.userService.GetAllGroup(id).pipe((0, rxjs_1.map)((data) => {
                return {
                    msg: 'Get all group successfully',
                    data: Object.assign({}, data),
                };
            }));
        }
        catch (err) {
            throw err;
        }
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', config_store_1.store_config)),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 100000 }),
            new common_1.FileTypeValidator({ fileType: 'image/png' }),
        ],
    }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('createManyFromExcel'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('fileUsers', config_store_1.store_config)),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createManyUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt-two-factor')),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('forgot-password'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUserById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('order_by')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPaginaion", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('get-all-group-user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllGroupOfUser", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        cloudinary_service_1.CloudinaryService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map