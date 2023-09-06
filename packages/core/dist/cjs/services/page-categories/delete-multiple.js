"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const PageCategory_js_1 = __importDefault(require("../../db/models/PageCategory.js"));
const deleteMultiple = async (client, data) => {
    const pageCategory = await PageCategory_js_1.default.deleteMultiple(client, {
        page_id: data.page_id,
        category_ids: data.category_ids,
    });
    if (pageCategory.length !== data.category_ids.length) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Page Category Not Deleted",
            message: "There was an error deleting the page category.",
            status: 500,
        });
    }
    return pageCategory;
};
exports.default = deleteMultiple;
//# sourceMappingURL=delete-multiple.js.map