"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_1 = __importDefault(require("../../db/models/Media"));
const getMultiple = async (data) => {
    const medias = await Media_1.default.getMultiple(data.query);
    return medias;
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map