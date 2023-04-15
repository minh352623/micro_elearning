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
const search_service_1 = require("../search/search.service");
const XLSX = require('xlsx');
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    constructor(databaseService, searchService) {
        this.databaseService = databaseService;
        this.searchService = searchService;
        this.loggerService = new common_1.Logger();
    }
    async CreateUser(userDTO) {
        try {
            this.loggerService.log('Create User');
            userDTO.password = await bcrypt.hash(userDTO.password, 10);
            const userCreate = await this.databaseService.user.create({
                data: Object.assign({}, userDTO),
            });
            const currentTime = new Date().getTime();
            const test = await this.searchService.createIndex('user', userCreate);
            return (0, rxjs_1.of)(Object.assign(Object.assign({}, userCreate), { createAt: currentTime, updateAt: currentTime }));
        }
        catch (err) {
            console.log(err);
        }
    }
    async createManyUser(fileUsers) {
        var _a, _b, _c, _d;
        try {
            this.loggerService.log('Create Many User');
            const workbook = XLSX.readFile(fileUsers.path);
            const workSheet = workbook.Sheets[workbook.SheetNames[0]];
            const userArr = [];
            for (let index = 2; index < 5; index++) {
                let hash = ((_a = workSheet[`D${index}`]) === null || _a === void 0 ? void 0 : _a.v) &&
                    bcrypt.hashSync(((_b = workSheet[`D${index}`]) === null || _b === void 0 ? void 0 : _b.v).toString());
                const user = {
                    fullname: (_c = workSheet[`B${index}`]) === null || _c === void 0 ? void 0 : _c.v,
                    email: (_d = workSheet[`C${index}`]) === null || _d === void 0 ? void 0 : _d.v,
                    password: hash,
                };
                if (user.fullname && user.email && user.password) {
                    userArr.push(user);
                }
            }
            if (userArr.length > 0) {
                console.log(userArr);
                const importUsers = await this.databaseService.user.createMany({
                    data: userArr,
                });
                console.log(importUsers);
                return {
                    msg: 'excel successfully imported',
                };
            }
            throw new common_1.HttpException('Data not found', common_1.HttpStatus.BAD_REQUEST);
        }
        catch (err) {
            console.log(err);
        }
    }
    async UpdateUser(id, userDTO) {
        try {
            this.loggerService.log('Update User');
            const userUpdate = this.databaseService.user.update({
                data: Object.assign({}, userDTO),
                where: {
                    id: Number(id),
                },
            });
            const currentTime = new Date().getTime();
            return (0, rxjs_1.of)(Object.assign(Object.assign({}, userUpdate), { createAt: currentTime, updateAt: currentTime }));
        }
        catch (err) {
            this.loggerService.error('Failed to update user', err);
            throw err;
        }
    }
    Delete(id) {
        try {
            this.loggerService.log('Create delete exchange ' + id);
            return (0, rxjs_1.from)(this.databaseService.user.findUnique({
                where: {
                    id: Number(id),
                },
            })).pipe((0, rxjs_1.switchMap)((data) => {
                if (data.id == id) {
                    return (0, rxjs_1.from)(this.databaseService.user.update({
                        data: {
                            deleted: true,
                        },
                        where: {
                            id: Number(id),
                        },
                    }));
                }
                throw new common_1.HttpException('Not found user have id ->: ' + id, common_1.HttpStatus.BAD_REQUEST);
            }));
        }
        catch (err) {
            this.loggerService.error('Failed to delete exchange', err);
            throw err;
        }
    }
    GetAllUser(limit = 10, page = 1, search = '', order_by = 'desc') {
        try {
            this.loggerService.log('Get users dashboard');
            if (limit <= 0 || page <= 0)
                throw new common_1.HttpException('limit or page is invalid', common_1.HttpStatus.BAD_REQUEST);
            return (0, rxjs_1.from)(this.databaseService.user.findMany({
                where: {
                    OR: [
                        {
                            fullname: { contains: search },
                        },
                        {
                            email: { contains: search },
                        },
                        {
                            address: { contains: search },
                        },
                    ],
                },
                take: Number(limit),
                skip: Number(limit) * (Number(page) - 1),
                orderBy: {
                    id: order_by === 'desc' ? 'desc' : 'asc',
                },
            }));
        }
        catch (err) {
            this.loggerService.error('Failed to get users', err);
            throw err;
        }
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
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        search_service_1.SearchService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map