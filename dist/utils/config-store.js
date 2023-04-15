"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store_config = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
exports.store_config = {
    storage: (0, multer_1.diskStorage)({
        destination: './src/uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
};
//# sourceMappingURL=config-store.js.map