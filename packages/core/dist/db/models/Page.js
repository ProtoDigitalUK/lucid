"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
const PageCategory_1 = __importDefault(require("../models/PageCategory"));
const Collection_1 = __importDefault(require("../models/Collection"));
const QueryBuilder_1 = __importDefault(require("../../services/models/QueryBuilder"));
class Page {
}
_a = Page;
Page.getMultiple = async (req) => {
    const { filter, sort, page, per_page } = req.query;
    const QueryB = new QueryBuilder_1.default({
        columns: [
            "id",
            "collection_key",
            "parent_id",
            "title",
            "slug",
            "full_slug",
            "homepage",
            "excerpt",
            "published",
            "published_at",
            "published_by",
            "created_by",
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
                slug: {
                    operator: "ILIKE",
                    type: "string",
                    columnType: "standard",
                },
                category_id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                    table: "lucid_page_categories",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const { select, where, order, pagination } = QueryB.query;
    const pages = await db_1.default.query({
        text: `SELECT
          ${select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${where}
        GROUP BY lucid_pages.id
        ${order}
        ${pagination}`,
        values: QueryB.values,
    });
    const count = await db_1.default.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${where}
        `,
        values: QueryB.countValues,
    });
    return {
        data: pages.rows,
        count: count.rows[0].count,
    };
};
Page.create = async (req, data) => {
    const parentId = data.homepage ? null : data.parent_id || null;
    const collectionFound = await Collection_1.default.findCollection(data.collection_key, "multiple");
    if (!collectionFound) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" and of type "multiple" not found`,
            status: 404,
        });
    }
    await Page.checkParentNotHomepage(data.parent_id || null);
    if (parentId) {
        await Page.isParentSameCollection(parentId, data.collection_key);
    }
    const slug = await Page.slugUnique(data.slug, parentId);
    const fullSlug = await Page.computeFullSlug(slug, parentId, data.homepage || false);
    const page = await db_1.default.query({
        text: `INSERT INTO lucid_pages (title, slug, full_slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        values: [
            data.title,
            slug,
            fullSlug,
            data.homepage || false,
            data.collection_key,
            data.excerpt || null,
            data.published || false,
            parentId,
            req.auth.id,
        ],
    });
    if (!page.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Not Created",
            message: "There was an error creating the page",
            status: 500,
        });
    }
    if (data.category_ids) {
        await PageCategory_1.default.create({
            page_id: page.rows[0].id,
            category_ids: data.category_ids,
            collection_key: data.collection_key,
        });
    }
    if (data.homepage) {
        await Page.resetHomepages(page.rows[0].id);
    }
    return page.rows[0];
};
Page.slugUnique = async (slug, parent_id) => {
    const values = [slug];
    if (parent_id)
        values.push(parent_id);
    const slugCount = await db_1.default.query({
        text: `SELECT COUNT(*) FROM lucid_pages WHERE slug ~ '^${slug}-\\d+$' OR slug = $1 ${parent_id ? `AND parent_id = $2` : `AND parent_id IS NULL`}`,
        values: values,
    });
    if (slugCount.rows[0].count >= 1)
        return `${slug}-${slugCount.rows[0].count}`;
    return slug;
};
Page.checkParentNotHomepage = async (parent_id) => {
    if (!parent_id)
        return;
    const values = [];
    if (parent_id)
        values.push(parent_id);
    const parent = await db_1.default.query({
        text: `SELECT homepage FROM lucid_pages ${parent_id ? `WHERE id = $1` : `WHERE parent_id IS NULL`}`,
        values: values,
    });
    if (parent.rows[0].homepage) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Homepage Parent",
            message: "The homepage cannot be set as a parent!",
            status: 400,
        });
    }
};
Page.isParentSameCollection = async (parent_id, collection_key) => {
    const parent = await db_1.default.query({
        text: `SELECT collection_key FROM lucid_pages WHERE id = $1`,
        values: [parent_id],
    });
    if (parent.rows[0].collection_key !== collection_key) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Parent Collection Mismatch",
            message: "The parent page must be in the same collection as the page you are creating!",
            status: 400,
        });
    }
};
Page.resetHomepages = async (current) => {
    await db_1.default.query({
        text: `UPDATE lucid_pages SET homepage = false, parent_id = null, full_slug = \'/\' || slug WHERE homepage = true AND id != $1`,
        values: [current],
    });
};
Page.computeFullSlug = async (slug, parent_id, homepage) => {
    if (homepage)
        return "/";
    if (!parent_id)
        return `/${slug}`;
    let fullSlug = "";
    const getParent = async (id) => {
        const parent = await db_1.default.query({
            text: `SELECT slug, parent_id FROM lucid_pages WHERE id = $1`,
            values: [id],
        });
        if (parent.rows[0].parent_id) {
            await getParent(parent.rows[0].parent_id);
        }
        fullSlug = `${parent.rows[0].slug}/${fullSlug}`;
    };
    await getParent(parent_id);
    return `/${fullSlug}${slug}`;
};
exports.default = Page;
//# sourceMappingURL=Page.js.map