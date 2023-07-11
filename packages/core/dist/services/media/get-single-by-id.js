"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../media"));
const getSingleById = async (data) => {
    const media = await Media_1.default.getSingle(data.key);
    if (!media) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Media not found",
            message: "We couldn't find the media you were looking for.",
            status: 404,
        });
    }
    return media_1.default.format(media);
};
exports.default = getSingleById;
//# sourceMappingURL=get-single-by-id.js.map