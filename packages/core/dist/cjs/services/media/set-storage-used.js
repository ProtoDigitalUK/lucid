"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../media/index.js"));
const index_js_2 = __importDefault(require("../options/index.js"));
const getStorageUsed = async (client, data) => {
    const storageUsed = await (0, service_js_1.default)(index_js_1.default.getStorageUsed, false, client)();
    let newValue = (storageUsed || 0) + data.add;
    if (data.minus !== undefined) {
        newValue = newValue - data.minus;
    }
    const res = await (0, service_js_1.default)(index_js_2.default.patchByName, false, client)({
        name: "media_storage_used",
        value: newValue,
        type: "number",
    });
    return res.media_storage_used;
};
exports.default = getStorageUsed;
//# sourceMappingURL=set-storage-used.js.map