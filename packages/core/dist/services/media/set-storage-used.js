"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const media_1 = __importDefault(require("../media"));
const options_1 = __importDefault(require("../options"));
const getStorageUsed = async (client, data) => {
    const storageUsed = await (0, service_1.default)(media_1.default.getStorageUsed, false, client)();
    let newValue = storageUsed + data.add;
    if (data.minus !== undefined) {
        newValue = newValue - data.minus;
    }
    const res = await (0, service_1.default)(options_1.default.patchByName, false, client)({
        name: "media_storage_used",
        value: newValue,
        type: "number",
    });
    return res.option_value;
};
exports.default = getStorageUsed;
//# sourceMappingURL=set-storage-used.js.map