"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../media"));
const getMultipleByIds = async (data) => {
    const mediasRes = await Media_1.default.getMultipleByIds(data.ids);
    if (!mediasRes) {
        return [];
    }
    return mediasRes.map((media) => media_1.default.format(media));
};
exports.default = getMultipleByIds;
//# sourceMappingURL=get-multiple-by-ids.js.map