"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_1 = __importDefault(require("../../db/models/Media"));
const createSingle = async (data) => {
    const media = await Media_1.default.createSingle({
        name: data.name,
        alt: data.alt,
        files: data.files,
    });
    return media;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map