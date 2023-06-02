"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
const QueryBuilder_1 = __importDefault(require("../../services/models/QueryBuilder"));
const Collection_1 = __importDefault(require("../models/Collection"));
class Category {
}
_a = Category;
Category.getMultiple = async (req) => {
    const { filter, sort, page, per_page } = req.query;
    const QueryB = new QueryBuilder_1.default({
        columns: [
            "id",
            "collection_key",
            "title",
            "slug",
            "description",
            "created_at",
            "updated_at",
        ],
        exclude: undefined,
        filter: {
            data: filter,
            meta: {
                collection_key: {
                    operator: "=",
                    type: "string",
                    columnType: "standard",
                },
                title: {
                    operator: "ILIKE",
                    type: "string",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const { select, where, order, pagination } = QueryB.query;
    const categories = await db_1.default.query({
        text: `SELECT ${select} FROM lucid_categories ${where} ${order} ${pagination}`,
        values: QueryB.values,
    });
    const count = await db_1.default.query({
        text: `SELECT COUNT(*) FROM lucid_categories ${where}`,
        values: QueryB.countValues,
    });
    return {
        data: categories.rows,
        count: count.rows[0].count,
    };
};
Category.getSingle = async (id) => {
    const category = await db_1.default.query({
        text: "SELECT * FROM lucid_categories WHERE id = $1",
        values: [id],
    });
    if (!category.rows[0]) {
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
            }),
        });
    }
    return category.rows[0];
};
Category.create = async (data) => {
    const collectionFound = await Collection_1.default.findCollection(data.collection_key, "multiple");
    if (!collectionFound) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" and of type "multiple" not found`,
            status: 404,
        });
    }
    const isSlugUnique = await Category.isSlugUniqueInPostType(data.collection_key, data.slug);
    if (!isSlugUnique) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Created",
            message: "Please provide a unique slug within this post type.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
                slug: {
                    code: "not_unique",
                    message: "Please provide a unique slug within this post type.",
                },
            }),
        });
    }
    const res = await db_1.default.query({
        name: "create-category",
        text: `INSERT INTO lucid_categories(collection_key, title, slug, description) VALUES($1, $2, $3, $4) RETURNING *`,
        values: [data.collection_key, data.title, data.slug, data.description],
    });
    const category = res.rows[0];
    if (!category) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Created",
            message: "There was an error creating the category.",
            status: 500,
        });
    }
    return category;
};
Category.update = async (id, data) => {
    const currentCategory = await Category.getSingle(id);
    if (data.slug) {
        const isSlugUnique = await Category.isSlugUniqueInPostType(currentCategory.collection_key, data.slug, id);
        if (!isSlugUnique) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Category Not Updated",
                message: "Please provide a unique slug within this post type.",
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    slug: {
                        code: "not_unique",
                        message: "Please provide a unique slug within this post type.",
                    },
                }),
            });
        }
    }
    const category = await db_1.default.query({
        name: "update-category",
        text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 RETURNING *`,
        values: [data.title, data.slug, data.description, id],
    });
    if (!category.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Updated",
            message: "There was an error updating the category.",
            status: 500,
        });
    }
    return category.rows[0];
};
Category.delete = async (id) => {
    const category = await db_1.default.query({
        name: "delete-category",
        text: `DELETE FROM lucid_categories WHERE id = $1 RETURNING *`,
        values: [id],
    });
    if (!category.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Deleted",
            message: "There was an error deleting the category.",
            status: 500,
        });
    }
    return category.rows[0];
};
Category.isSlugUniqueInPostType = async (collection_key, slug, ignore_id) => {
    const values = [collection_key, slug];
    if (ignore_id) {
        values.push(ignore_id);
    }
    const res = await db_1.default.query({
        name: "is-slug-unique-in-post-type",
        text: `SELECT * FROM lucid_categories WHERE collection_key = $1 AND slug = $2 ${ignore_id ? "AND id != $3" : ""}`,
        values: values,
    });
    const category = res.rows[0];
    if (category) {
        return false;
    }
    return true;
};
exports.default = Category;
//# sourceMappingURL=Category.js.map