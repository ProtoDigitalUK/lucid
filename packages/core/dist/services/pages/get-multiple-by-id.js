"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = __importDefault(require("../../db/models/Page"));
const format_page_1 = __importDefault(require("../../utils/format/format-page"));
const getMultipleById = async (data) => {
    const pages = await Page_1.default.getMultipleByIds({
        ids: data.ids,
        environment_key: data.environment_key,
    });
    return pages.map((page) => (0, format_page_1.default)(page));
};
exports.default = getMultipleById;
//# sourceMappingURL=get-multiple-by-id.js.map