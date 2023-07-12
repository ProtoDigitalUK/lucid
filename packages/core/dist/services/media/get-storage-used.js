"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = __importDefault(require("../options"));
const getStorageUsed = async () => {
    const res = await options_1.default.getByName({
        name: "media_storage_used",
    });
    return res.option_value;
};
exports.default = getStorageUsed;
//# sourceMappingURL=get-storage-used.js.map