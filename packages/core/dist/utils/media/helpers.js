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
const createProcessKey = (data) => {
    let key = `processed/${data.key}`;
    if (data.query.format)
        key = key.concat(`.${data.query.format}`);
    if (data.query.quality)
        key = key.concat(`.${data.query.quality}`);
    if (data.query.width)
        key = key.concat(`.${data.query.width}`);
    if (data.query.height)
        key = key.concat(`.${data.query.height}`);
    return key;
};
const streamToBuffer = (readable) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readable.on("data", (chunk) => chunks.push(chunk));
        readable.on("end", () => resolve(Buffer.concat(chunks)));
        readable.on("error", reject);
    });
};
const getMediaType = (mimeType) => {
    const normalizedMimeType = mimeType.toLowerCase();
    if (normalizedMimeType.includes("image"))
        return "image";
    if (normalizedMimeType.includes("video"))
        return "video";
    if (normalizedMimeType.includes("audio"))
        return "audio";
    if (normalizedMimeType.includes("pdf") ||
        normalizedMimeType.startsWith("application/vnd"))
        return "document";
    if (normalizedMimeType.includes("zip") || normalizedMimeType.includes("tar"))
        return "archive";
    return "unknown";
};
const helpers = {
    uniqueKey,
    getMetaData,
    formatReqFiles,
    createProcessKey,
    streamToBuffer,
    getMediaType,
};
exports.default = helpers;
//# sourceMappingURL=helpers.js.map