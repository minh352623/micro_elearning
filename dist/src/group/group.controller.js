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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const passport_1 = require("@nestjs/passport");
const group_dto_1 = require("./group.dto");
const rxjs_1 = require("rxjs");
let GroupController = class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }
    async createGroup(groupDTO) {
        common_1.Controller;
        try {
            return (await this.groupService.CreateGroup(groupDTO)).pipe((0, rxjs_1.map)((data) => {
                return {
                    msg: 'Create group successfully',
                    data: Object.assign(Object.assign({}, data), { createAt: Number(data.createAt), updateAt: Number(data.updateAt) }),
                };
            }));
        }
        catch (error) {
            console.log(error);
        }
    }
    async getPaginaion(limit = 10, page = 1, search = undefined, order_by = 'desc') {
        try {
            const countGroup = await this.groupService.countGroup();
            return this.groupService.GetAllGroup(limit, page, search, order_by).pipe((0, rxjs_1.map)((data) => {
                return {
                    totalRow: countGroup,
                    msg: 'Get all group successfully',
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
    async updateUser(id, groupDTO) {
        try {
            return (await this.groupService.UpdateGroup(id, groupDTO)).pipe((0, rxjs_1.map)((data) => {
                return {
                    msg: 'Update group successfully',
                    data: Object.assign({}, data),
                };
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
    deleteUserById(id) {
        try {
            return this.groupService.Delete(id).pipe((0, rxjs_1.map)((data) => {
                const user = __rest(data, []);
                return {
                    msg: 'Delete group successfully',
                    data: Object.assign(Object.assign({}, user), { createAt: Number(data.createdAt), updateAt: Number(data.updatedAt) }),
                };
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
    async addUserToGroup(dataAddUserToGroup) {
        common_1.Controller;
        try {
            return (await this.groupService.addUserToGroup(dataAddUserToGroup)).pipe((0, rxjs_1.map)((data) => {
                return {
                    msg: 'Add user to group successfully',
                    data: Object.assign({}, data),
                };
            }));
        }
        catch (error) {
            console.log(error);
        }
    }
    async getGroupById(id) {
        common_1.Controller;
        try {
            return (await this.groupService.getOneGroupById(id)).pipe((0, rxjs_1.map)((data) => {
                return {
                    msg: 'Get user successfully',
                    data: Object.assign({}, data),
                };
            }));
        }
        catch (error) {
            console.log(error);
        }
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [group_dto_1.GroupDTO]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
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
], GroupController.prototype, "getPaginaion", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "deleteUserById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('add-user-to-group'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [group_dto_1.DataAddUserToGroup]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "addUserToGroup", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('getById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getGroupById", null);
GroupController = __decorate([
    (0, common_1.Controller)('group'),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
exports.GroupController = GroupController;
//# sourceMappingURL=group.controller.js.map