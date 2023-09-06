"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../options/index.js"));
const getStorageUsed = async (client) => {
    const res = await (0, service_js_1.default)(index_js_1.default.getByName, false, client)({
        name: "media_storage_used",
    });
    return res.media_storage_used;
};
exports.default = getStorageUsed;
//# sourceMappingURL=get-storage-used.js.map