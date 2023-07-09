"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_1 = __importDefault(require("../../db/models/Media"));
const deleteSingle = async (data) => {
    const media = await Media_1.default.deleteSingle(data.key);
    return media;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map