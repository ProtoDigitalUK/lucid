"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
const QueryBuilder_1 = __importDefault(require("../../services/models/QueryBuilder"));
class Category {
}
_a = Category;
Category.getMultiple = async (req) => {
    const { filter, sort, page, per_page } = req.query;
    const QueryB = new QueryBuilder_1.default({
        columns: [
            "id",
            "post_type_id",
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
                post_type_id: {
                    operator: "=",
                    type: "int",
                },
                title: {
                    operator: "ILIKE",
                    type: "string",
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
Category.create = async (data) => {
    const isSlugUnique = await Category.isSlugUniqueInPostType(data.post_type_id, data.slug);
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
        text: `INSERT INTO lucid_categories(post_type_id, title, slug, description) VALUES($1, $2, $3, $4) RETURNING *`,
        values: [data.post_type_id, data.title, data.slug, data.description],
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
Category.isSlugUniqueInPostType = async (post_type_id, slug) => {
    const res = await db_1.default.query({
        name: "is-slug-unique-in-post-type",
        text: `SELECT * FROM lucid_categories WHERE post_type_id = $1 AND slug = $2`,
        values: [post_type_id, slug],
    });
    const category = res.rows[0];
    if (category) {
        return false;
    }
    return true;
};
exports.default = Category;
//# sourceMappingURL=Category.js.map