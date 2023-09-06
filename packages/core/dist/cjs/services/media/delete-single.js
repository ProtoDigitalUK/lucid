"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Media_js_1 = __importDefault(require("../../db/models/Media.js"));
const index_js_1 = __importDefault(require("../media/index.js"));
const index_js_2 = __importDefault(require("../s3/index.js"));
const index_js_3 = __importDefault(require("../processed-images/index.js"));
const deleteSingle = async (client, data) => {
    const media = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        id: data.id,
    });
    await (0, service_js_1.default)(index_js_3.default.clearSingle, false, client)({
        id: media.id,
    });
    await Media_js_1.default.deleteSingle(client, {
        key: media.key,
    });
    await index_js_2.default.deleteObject({
        key: media.key,
    });
    await (0, service_js_1.default)(index_js_1.default.setStorageUsed, false, client)({
        add: 0,
        minus: media.meta.file_size,
    });
    return undefined;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map