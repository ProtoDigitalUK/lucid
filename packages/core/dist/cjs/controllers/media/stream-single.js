"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const media_js_1 = __importDefault(require("../../schemas/media.js"));
const index_js_1 = __importDefault(require("../../services/media/index.js"));
const streamSingleController = async (req, res, next) => {
    try {
        const response = await index_js_1.default.streamMedia({
            key: req.params.key,
            query: req.query,
        });
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        if (response !== undefined) {
            res.setHeader("Content-Disposition", `inline; filename="${req.params.key}"`);
            if (response?.contentLength)
                res.setHeader("Content-Length", response.contentLength);
            if (response?.contentType)
                res.setHeader("Content-Type", response.contentType);
            if (response?.body !== undefined)
                response.body.pipe(res);
        }
    }
    catch (error) {
        await index_js_1.default.streamErrorImage({
            fallback: req.query?.fallback,
            error: error,
            res: res,
            next: next,
        });
    }
};
exports.default = {
    schema: media_js_1.default.streamSingle,
    controller: streamSingleController,
};
//# sourceMappingURL=stream-single.js.map