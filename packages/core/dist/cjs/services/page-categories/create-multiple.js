"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const PageCategory_js_1 = __importDefault(require("../../db/models/PageCategory.js"));
const index_js_1 = __importDefault(require("../page-categories/index.js"));
const createMultiple = async (client, data) => {
    await (0, service_js_1.default)(index_js_1.default.verifyCategoriesInCollection, false, client)({
        category_ids: data.category_ids,
        collection_key: data.collection_key,
    });
    const pageCategory = await PageCategory_js_1.default.createMultiple(client, {
        page_id: data.page_id,
        category_ids: data.category_ids,
    });
    if (pageCategory.length !== data.category_ids.length) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Page Category Not Created",
            message: "There was an error creating the page category.",
            status: 500,
        });
    }
    return pageCategory;
};
exports.default = createMultiple;
//# sourceMappingURL=create-multiple.js.map