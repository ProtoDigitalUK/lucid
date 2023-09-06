"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_js_1 = __importDefault(require("../../db/models/Media.js"));
const format_media_js_1 = __importDefault(require("../../utils/format/format-media.js"));
const getMultipleByIds = async (client, data) => {
    const mediasRes = await Media_js_1.default.getMultipleByIds(client, {
        ids: data.ids,
    });
    if (!mediasRes) {
        return [];
    }
    return mediasRes.map((media) => (0, format_media_js_1.default)(media));
};
exports.default = getMultipleByIds;
//# sourceMappingURL=get-multiple-by-ids.js.map