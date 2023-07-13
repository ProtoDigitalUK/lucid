"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Page_1 = __importDefault(require("../../db/models/Page"));
const pages_1 = __importDefault(require("../pages"));
const format_page_1 = __importDefault(require("../../utils/format/format-page"));
const deleteSingle = async (data) => {
    await pages_1.default.checkPageExists({
        id: data.id,
        environment_key: data.environment_key,
    });
    const page = await Page_1.default.deleteSingle({
        id: data.id,
    });
    if (!page) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Not Deleted",
            message: "There was an error deleting the page",
            status: 500,
        });
    }
    return (0, format_page_1.default)(page);
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map