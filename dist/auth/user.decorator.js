"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
exports.GetUser = (0, common_1.createParamDecorator)((key, context) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return key ? user === null || user === void 0 ? void 0 : user[key] : user;
});
//# sourceMappingURL=user.decorator.js.map