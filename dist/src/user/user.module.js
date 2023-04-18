"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const database_service_1 = require("../database/database.service");
const jwtTwoFactor_strategy_1 = require("../auth/jwtTwoFactor.strategy");
const jwt_strategy_1 = require("../auth/jwt.strategy");
const search_module_1 = require("../search/search.module");
const cloudinary_module_1 = require("../cloundinay/cloudinary.module");
const kafka_module_1 = require("../kafka/kafka.module");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            search_module_1.SearchModule,
            cloudinary_module_1.CloudinaryModule,
            kafka_module_1.KafkaModule,
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, database_service_1.DatabaseService, jwtTwoFactor_strategy_1.JwtTwoFactorStrategy, jwt_strategy_1.JwtStrategy],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map