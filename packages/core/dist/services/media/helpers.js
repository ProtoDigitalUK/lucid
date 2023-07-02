"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const mime_types_1 = __importDefault(require("mime-types"));
const sharp_1 = __importDefault(require("sharp"));
const uniqueKey = (name) => {
    const slug = (0, slugify_1.default)(name, {
        lower: true,
        strict: true,
    });
    return `${slug}-${Date.now()}`;
};
const getMetaData = async (file) => {
    const fileExtension = mime_types_1.default.extension(file.mimetype);
    const mimeType = file.mimetype;
    const size = file.size;
    let width = null;
    let height = null;
    try {
        const metaData = await (0, sharp_1.default)(file.data).metadata();
        width = metaData.width;
        height = metaData.height;
    }
    catch (error) { }
    return {
        mimeType: mimeType,
        fileExtension: fileExtension || "",
        size: size,
        width: width || null,
        height: height || null,
    };
};
const formatReqFiles = (files) => {
    const file = files["file"];
    if (Array.isArray(file)) {
        return file;
    }
    else {
        return [file];
    }
};
const helpers = {
    uniqueKey,
    getMetaData,
    formatReqFiles,
};
exports.default = helpers;
//# sourceMappingURL=helpers.js.map