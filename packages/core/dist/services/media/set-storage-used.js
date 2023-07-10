"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = __importDefault(require("../../db/models/Option"));
const media_1 = __importDefault(require("../media"));
const getStorageUsed = async (data) => {
    const storageUsed = await media_1.default.getStorageUsed();
    let newValue = storageUsed + data.add;
    if (data.minus !== undefined) {
        newValue = newValue - data.minus;
    }
    const res = await Option_1.default.patchByName({
        name: "media_storage_used",
        value: newValue,
        type: "number",
    });
    return res.option_value;
};
exports.default = getStorageUsed;
//# sourceMappingURL=set-storage-used.js.map