"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
class Category {
}
_a = Category;
Category.getMultiple = async (query_instance) => {
    const client = await db_1.default;
    const categories = client.query({
        text: `SELECT ${query_instance.query.select} FROM lucid_categories ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
        values: query_instance.values,
    });
    const count = client.query({
        text: `SELECT COUNT(*) FROM lucid_categories ${query_instance.query.where}`,
        values: query_instance.countValues,
    });
    const data = await Promise.all([categories, count]);
    return {
        data: data[0].rows,
        count: parseInt(data[1].rows[0].count),
    };
};
Category.getSingle = async (environment_key, id) => {
    const client = await db_1.default;
    const category = await client.query({
        text: "SELECT * FROM lucid_categories WHERE id = $1 AND environment_key = $2",
        values: [id, environment_key],
    });
    return category.rows[0];
};
Category.createSingle = async (data) => {
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "environment_key",
            "collection_key",
            "title",
            "slug",
            "description",
        ],
        values: [
            data.environment_key,
            data.collection_key,
            data.title,
            data.slug,
            data.description,
        ],
    });
    const client = await db_1.default;
    const res = await client.query({
        text: `INSERT INTO lucid_categories (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return res.rows[0];
};
Category.updateSingle = async (environment_key, id, data) => {
    const client = await db_1.default;
    const category = await client.query({
        name: "update-category",
        text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 AND environment_key = $5 RETURNING *`,
        values: [data.title, data.slug, data.description, id, environment_key],
    });
    return category.rows[0];
};
Category.deleteSingle = async (environment_key, id) => {
    const client = await db_1.default;
    const category = await client.query({
        name: "delete-category",
        text: `DELETE FROM lucid_categories WHERE id = $1 AND environment_key = $2 RETURNING *`,
        values: [id, environment_key],
    });
    return category.rows[0];
};
Category.isSlugUniqueInCollection = async (data) => {
    const client = await db_1.default;
    const values = [
        data.collection_key,
        data.slug,
        data.environment_key,
    ];
    if (data.ignore_id) {
        values.push(data.ignore_id);
    }
    const res = await client.query({
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