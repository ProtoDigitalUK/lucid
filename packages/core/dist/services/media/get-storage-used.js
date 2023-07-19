"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const options_1 = __importDefault(require("../options"));
const getStorageUsed = async (client) => {
    const res = await (0, service_1.default)(options_1.default.getByName, false, client)({
        name: "media_storage_used",
    });
    return res.media_storage_used;
};
exports.default = getStorageUsed;
//# sourceMappingURL=get-storage-used.js.map