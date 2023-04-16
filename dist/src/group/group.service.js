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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const search_service_1 = require("../search/search.service");
const rxjs_1 = require("rxjs");
let GroupService = class GroupService {
    constructor(databaseService, searchService) {
        this.databaseService = databaseService;
        this.searchService = searchService;
        this.loggerService = new common_1.Logger();
    }
    async CreateGroup(group) {
        try {
            this.loggerService.log('Create Group');
            const groupCreate = await this.databaseService.group.create({
                data: Object.assign({}, group),
            });
            const currentTime = new Date().getTime();
            return (0, rxjs_1.of)(Object.assign(Object.assign({}, groupCreate), { createAt: currentTime, updateAt: currentTime }));
        }
        catch (err) {
            console.log(err);
            this.loggerService.error('Failed to update user', err);
            throw err;
        }
    }
    async UpdateGroup(id, groupData) {
        try {
            this.loggerService.log('Update Group ' + id);
            return (0, rxjs_1.from)(this.databaseService.group.update({
                data: Object.assign({}, groupData),
                where: {
                    id: Number(id),
                },
            }));
        }
        catch (err) {
            console.log(err);
            this.loggerService.error('Failed to update group', err);
            throw err;
        }
    }
    Delete(id) {
        try {
            this.loggerService.log('Create delete exchange ' + id);
            return (0, rxjs_1.from)(this.databaseService.group.findUnique({
                where: {
                    id: Number(id),
                },
            })).pipe((0, rxjs_1.switchMap)((data) => {
                if (data.id == id) {
                    return (0, rxjs_1.from)(this.databaseService.group.update({
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
    GetAllGroup(limit = 10, page = 1, search = '', order_by = 'desc') {
        try {
            this.loggerService.log('Get group dashboard');
            if (limit <= 0 || page <= 0)
                throw new common_1.HttpException('limit or page is invalid', common_1.HttpStatus.BAD_REQUEST);
            return (0, rxjs_1.from)(this.databaseService.group.findMany({
                where: {
                    OR: [
                        {
                            name: { contains: search },
                        },
                    ],
                    deleted: false,
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
    async countGroup() {
        try {
            return await this.databaseService.group.count({
                where: {
                    deleted: false,
                },
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async addUserToGroup(dataAddUserToGroup) {
        try {
            const dataNew = dataAddUserToGroup.groups.map((group_id) => ({
                groupId: group_id,
                userId: dataAddUserToGroup.id_user,
            }));
            return (0, rxjs_1.from)(this.databaseService.groupUser.createMany({
                data: dataNew,
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
    async getOneGroupById(id) {
        try {
            return (0, rxjs_1.from)(this.databaseService.group.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    users: {
                        include: {
                            user: {
                                select: {
                                    fullname: true,
                                },
                            },
                        },
                    },
                },
            }));
        }
        catch (err) {
            console.log(err);
        }
    }
};
GroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        search_service_1.SearchService])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map