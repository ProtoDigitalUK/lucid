"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const Collection_1 = __importDefault(require("../models/Collection"));
const error_handler_1 = require("../../utils/error-handler");
const query_helpers_1 = require("../../utils/query-helpers");
class Category {
}
_a = Category;
Category.getMultiple = async (environment_key, query) => {
    const { filter, sort, page, per_page } = query;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
            "collection_key",
            "title",
            "slug",
            "description",
            "created_at",
            "updated_at",
        ],
        exclude: undefined,
        filter: {
            data: {
                ...filter,
                environment_key: environment_key,
            },
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
                environment_key: {
                    operator: "=",
                    type: "string",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const categories = await db_1.default.query({
        text: `SELECT ${SelectQuery.query.select} FROM lucid_categories ${SelectQuery.query.where} ${SelectQuery.query.order} ${SelectQuery.query.pagination}`,
        values: SelectQuery.values,
    });
    const count = await db_1.default.query({
        text: `SELECT COUNT(*) FROM lucid_categories ${SelectQuery.query.where}`,
        values: SelectQuery.countValues,
    });
    return {
        data: categories.rows,
        count: count.rows[0].count,
    };
};
Category.getSingle = async (environment_key, id) => {
    const category = await db_1.default.query({
        text: "SELECT * FROM lucid_categories WHERE id = $1 AND environment_key = $2",
        values: [id, environment_key],
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
    await Collection_1.default.getSingle(data.collection_key, "pages", data.environment_key);
    const isSlugUnique = await Category.isSlugUniqueInCollection({
        collection_key: data.collection_key,
        slug: data.slug,
        environment_key: data.environment_key,
    });
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
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)(["environment_key", "collection_key", "title", "slug", "description"], [
        data.environment_key,
        data.collection_key,
        data.title,
        data.slug,
        data.description,
    ]);
    const res = await db_1.default.query({
        name: "create-category",
        text: `INSERT INTO lucid_categories (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
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
Category.update = async (environment_key, id, data) => {
    const currentCategory = await Category.getSingle(environment_key, id);
    if (data.slug) {
        const isSlugUnique = await Category.isSlugUniqueInCollection({
            collection_key: currentCategory.collection_key,
            slug: data.slug,
            environment_key: environment_key,
            ignore_id: id,
        });
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
        text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 AND environment_key = $5 RETURNING *`,
        values: [data.title, data.slug, data.description, id, environment_key],
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
Category.delete = async (environment_key, id) => {
    const category = await db_1.default.query({
        name: "delete-category",
        text: `DELETE FROM lucid_categories WHERE id = $1 AND environment_key = $2 RETURNING *`,
        values: [id, environment_key],
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
Category.isSlugUniqueInCollection = async (data) => {
    const values = [
        data.collection_key,
        data.slug,
        data.environment_key,
    ];
    if (data.ignore_id) {
        values.push(data.ignore_id);
    }
    const res = await db_1.default.query({
        text: `SELECT * FROM lucid_categories WHERE collection_key = $1 AND slug = $2 AND environment_key = $3 ${data.ignore_id ? "AND id != $4" : ""}`,
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