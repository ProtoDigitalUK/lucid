"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../../schemas/media"));
const streamSingle = async (req, res, next) => {
    try {
        const response = await Media_1.default.streamFile(req.params.key);
        res.setHeader("Content-Disposition", `inline; filename="${req.params.key}"`);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        if (response.ContentLength)
            res.setHeader("Content-Length", response.ContentLength);
        if (response.ContentType)
            res.setHeader("Content-Type", response.ContentType);
        response.Body.pipe(res);
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: media_1.default.streamSingle,
    controller: streamSingle,
};
//# sourceMappingURL=stream-single.js.map