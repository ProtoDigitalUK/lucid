"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const PageCategory_js_1 = __importDefault(require("../../db/models/PageCategory.js"));
const index_js_1 = __importDefault(require("../page-categories/index.js"));
const updateMultiple = async (client, data) => {
    const pageCategoriesRes = await PageCategory_js_1.default.getMultipleByPageId(client, {
        page_id: data.page_id,
    });
    const categoriesToAdd = data.category_ids.filter((id) => !pageCategoriesRes.find((pageCategory) => pageCategory.category_id === id));
    const categoriesToRemove = pageCategoriesRes.filter((pageCategory) => !data.category_ids.includes(pageCategory.category_id));
    const updatePromise = [];
    if (categoriesToAdd.length > 0) {
        updatePromise.push((0, service_js_1.default)(index_js_1.default.createMultiple, false, client)({
            page_id: data.page_id,
            category_ids: categoriesToAdd,
            collection_key: data.collection_key,
        }));
    }
    if (categoriesToRemove.length > 0) {
        updatePromise.push((0, service_js_1.default)(index_js_1.default.deleteMultiple, false, client)({
            page_id: data.page_id,
            category_ids: categoriesToRemove.map((category) => category.category_id),
        }));
    }
    const updateRes = await Promise.all(updatePromise);
    const newPageCategories = pageCategoriesRes.filter((pageCategory) => !categoriesToRemove.includes(pageCategory));
    if (categoriesToAdd.length > 0) {
        newPageCategories.push(...updateRes[0]);
    }
    return newPageCategories;
};
exports.default = updateMultiple;
//# sourceMappingURL=update-multiple.js.map