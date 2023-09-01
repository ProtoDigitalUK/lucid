"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const error_handler_1 = require("../../utils/app/error-handler");
const Config_1 = __importDefault(require("../Config"));
const media_1 = __importDefault(require("../media"));
const pipeLocalImage = (res) => {
    let pathVal = path_1.default.join(__dirname, "../../assets/404.jpg");
    let contentType = "image/jpeg";
    const steam = fs_extra_1.default.createReadStream(pathVal);
    res.setHeader("Content-Type", contentType);
    steam.pipe(res);
};
const streamErrorImage = async (data) => {
    if (Config_1.default.media.fallbackImage === false || data.fallback === "0") {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error",
            message: "We're sorry, but this image is not available.",
            status: 404,
        });
    }
    if (Config_1.default.media.fallbackImage === undefined) {
        pipeLocalImage(data.res);
        return;
    }
    try {
        media_1.default.pipeRemoteURL({
            url: Config_1.default.media.fallbackImage,
            res: data.res,
        });
    }
    catch (err) {
        pipeLocalImage(data.res);
        return;
    }
};
exports.default = streamErrorImage;
//# sourceMappingURL=steam-error-image.js.map