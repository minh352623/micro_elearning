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
const XLSX = require('xlsx');
const bcrypt = require("bcryptjs");
const mailer_1 = require("@nest-modules/mailer");
require("dotenv/config");
let UserService = class UserService {
    constructor(databaseService, mailerService) {
        this.databaseService = databaseService;
        this.mailerService = mailerService;
        this.loggerService = new common_1.Logger();
    }
    async onModuleInit() {
        try {
        }
        catch (err) {
            this.loggerService.error('An error while init the module exchange', err);
        }
    }
    async forgotPassword(userDTO) {
        try {
            this.loggerService.log('Forgot Passowrd');
            const check_sended_mail = await this.databaseService.forgotPassword.findFirst({
                where: {
                    email: userDTO.email,
                },
                orderBy: {
                    date_created: 'desc',
                },
            });
            if (check_sended_mail) {
                let now_date = new Date();
                let data_token = new Date(check_sended_mail.date_created);
                console.log(now_date);
                console.log(data_token);
                const minus = (now_date.getTime() - data_token.getTime()) / (1000 * 60);
                console.log(minus);
                if (minus > Number(process.env.TIME_LIMIT_SENDMAIL)) {
                    this.mailerService.sendMail({
                        to: userDTO.email,
                        subject: 'Welcome to my website',
                        template: './forgotPassword',
                        context: {
                            link: 'http://localhost:3001/front-end',
                        },
                    });
                }
                else {
                    throw new common_1.HttpException('Sau 1 phút mới được gửi mail lần tiếp theo!!!', common_1.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                this.mailerService.sendMail({
                    to: userDTO.email,
                    subject: 'Welcome to my website',
                    template: './forgotPassword',
                    context: {
                        link: 'http://localhost:3001/front-end',
                    },
                });
            }
            const forgot_check = await this.databaseService.forgotPassword.create({
                data: {
                    email: userDTO.email,
                },
            });
            console.log({ forgot_check });
            return {
                message: 'send mail success',
            };
        }
        catch (err) {
            console.log(err);
        }
    }
    async changePassword(userDTO) {
        try {
            this.loggerService.log('Change passsowrd');
            const check_sended_mail = await this.databaseService.forgotPassword.findFirst({
                where: {
                    email: userDTO.email,
                },
                orderBy: {
                    date_created: 'desc',
                },
            });
            if (check_sended_mail) {
                let now_date = new Date();
                let data_token = new Date(check_sended_mail.date_created);
                const minus = (now_date.getTime() - data_token.getTime()) / (1000 * 60);
                if (minus > Number(process.env.TIME_EFFECTIVE_SENDMAIL)) {
                    throw new common_1.HttpException(`Xác nhận mail có hiệu lực trong vòng ${process.env.TIME_EFFECTIVE_SENDMAIL} phút!!!`, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    userDTO.password = await bcrypt.hash(userDTO.password, 10);
                    await this.databaseService.user.update({
                        data: Object.assign({}, userDTO),
                        where: {
                            email: userDTO.email,
                        },
                    });
                }
            }
            else {
                throw new common_1.HttpException('Ban phải xác nhận qua mail trước !!', common_1.HttpStatus.BAD_REQUEST);
            }
            const forgot_check = await this.databaseService.forgotPassword.deleteMany({
                where: {
                    email: userDTO.email,
                },
            });
            return {
                message: 'Change password  success',
            };
        }
        catch (err) {
            console.log(err);
        }
    }
    async CreateUser(userDTO) {
        try {
            this.loggerService.log('Create User');
            userDTO.password = await bcrypt.hash(userDTO.password, 10);
            const userCreate = await this.databaseService.user.create({
                data: Object.assign({}, userDTO),
            });
            const currentTime = new Date().getTime();
            return (0, rxjs_1.of)(Object.assign(Object.assign({}, userCreate), { createAt: currentTime, updateAt: currentTime }));
        }
        catch (err) {
            console.log(err);
        }
    }
    async countUser() {
        try {
            return await this.databaseService.user.count();
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
                const importUsers = await this.databaseService.user.createMany({
                    data: userArr,
                });
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
            return (0, rxjs_1.from)(this.databaseService.user.update({
                data: Object.assign({}, userDTO),
                where: {
                    id: Number(id),
                },
            }));
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
        mailer_1.MailerService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map