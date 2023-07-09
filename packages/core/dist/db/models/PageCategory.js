"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/app/error-handler");
class PageCategory {
}
_a = PageCategory;
PageCategory.create = async (data) => {
    const client = await db_1.default;
    const { page_id, category_ids, collection_key } = data;
    await PageCategory.checkCategoryPostType(category_ids, collection_key);
    const categories = await client.query({
        text: `INSERT INTO lucid_page_categories (page_id, category_id) SELECT $1, id FROM lucid_categories WHERE id = ANY($2) RETURNING *`,
        values: [page_id, category_ids],
    });
    if (categories.rowCount !== category_ids.length) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Category Not Created",
            message: "There was an error creating the page category.",
            status: 500,
        });
    }
    return categories.rows;
};
PageCategory.delete = async (data) => {
    const client = await db_1.default;
    const { page_id, category_ids } = data;
    const deleteCategories = await client.query({
        text: `DELETE FROM lucid_page_categories WHERE page_id = $1 AND category_id = ANY($2) RETURNING *`,
        values: [page_id, category_ids],
    });
    if (deleteCategories.rowCount !== category_ids.length) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Category Not Deleted",
            message: "There was an error deleting the page category.",
            status: 500,
        });
    }
    return deleteCategories.rows;
};
PageCategory.update = async (data) => {
    const client = await db_1.default;
    const { page_id, category_ids, collection_key } = data;
    const pageCategoriesRes = await client.query({
        text: `SELECT * FROM lucid_page_categories WHERE page_id = $1`,
        values: [page_id],
    });
    const categoriesToAdd = category_ids.filter((id) => !pageCategoriesRes.rows.find((pageCategory) => pageCategory.category_id === id));
    const categoriesToRemove = pageCategoriesRes.rows.filter((pageCategory) => !category_ids.includes(pageCategory.category_id));
    const updatePromise = [];
    if (categoriesToAdd.length > 0) {
        updatePromise.push(PageCategory.create({
            page_id,
            category_ids: categoriesToAdd,
            collection_key,
        }));
    }
    if (categoriesToRemove.length > 0) {
        updatePromise.push(PageCategory.delete({
            page_id,
            category_ids: categoriesToRemove.map((category) => category.category_id),
        }));
    }
    const updateRes = await Promise.all(updatePromise);
    const newPageCategories = pageCategoriesRes.rows.filter((pageCategory) => !categoriesToRemove.includes(pageCategory));
    if (categoriesToAdd.length > 0) {
        newPageCategories.push(...updateRes[0]);
    }
    return newPageCategories;
};
PageCategory.checkCategoryPostType = async (category_ids, collection_key) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `SELECT id FROM lucid_categories WHERE id = ANY($1) AND collection_key = $2`,
        values: [category_ids, collection_key],
    });
    if (res.rows.length !== category_ids.length) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Found",
            message: "Category not found.",
            status: 404,
            errors: (0, error_handler_1.modelErrors)({
                id: {
                    code: "not_found",
                    message: "Category not found.",
                },
                collection_key: {
                    code: "not_found",
                    message: "Collection key not found.",
                },
            }),
        });
    }
};
exports.default = PageCategory;
//# sourceMappingURL=PageCategory.js.map