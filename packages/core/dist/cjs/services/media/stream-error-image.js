"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const error_handler_js_2 = require("../../utils/app/error-handler.js");
const Config_js_1 = __importDefault(require("../Config.js"));
const index_js_1 = __importDefault(require("../media/index.js"));
const pipeLocalImage = (res) => {
    let pathVal = path_1.default.join(__dirname, "../../assets/404.jpg");
    let contentType = "image/jpeg";
    const steam = fs_extra_1.default.createReadStream(pathVal);
    res.setHeader("Content-Type", contentType);
    steam.pipe(res);
};
const streamErrorImage = async (data) => {
    const error = (0, error_handler_js_2.decodeError)(data.error);
    if (error.status !== 404) {
        data.next(data.error);
        return;
    }
    if (Config_js_1.default.media.fallbackImage === false || data.fallback === "0") {
        data.next(new error_handler_js_1.LucidError({
            type: "basic",
            name: "Error",
            message: "We're sorry, but this image is not available.",
            status: 404,
        }));
        return;
    }
    if (Config_js_1.default.media.fallbackImage === undefined) {
        pipeLocalImage(data.res);
        return;
    }
    try {
        const { buffer, contentType } = await index_js_1.default.pipeRemoteURL({
            url: Config_js_1.default.media.fallbackImage,
        });
        data.res.setHeader("Content-Type", contentType || "image/jpeg");
        data.res.send(buffer);
    }
    catch (err) {
        pipeLocalImage(data.res);
        return;
    }
};
exports.default = streamErrorImage;
//# sourceMappingURL=stream-error-image.js.map