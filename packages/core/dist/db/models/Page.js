"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const format_page_1 = __importDefault(require("../../utils/format/format-page"));
const error_handler_1 = require("../../utils/app/error-handler");
const query_helpers_1 = require("../../utils/app/query-helpers");
const collections_1 = __importDefault(require("../../services/collections"));
const environments_1 = __importDefault(require("../../services/environments"));
const collection_bricks_1 = __importDefault(require("../../services/collection-bricks"));
const page_categories_1 = __importDefault(require("../../services/page-categories"));
const pages_1 = __importDefault(require("../../services/pages"));
class Page {
}
_a = Page;
Page.getMultiple = async (query, data) => {
    const client = await db_1.default;
    const { filter, sort, page, per_page } = query;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
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
            data: {
                ...filter,
                environment_key: data.environment_key,
            },
            meta: {
                collection_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                title: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                slug: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                category_id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                    table: "lucid_page_categories",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const pages = await client.query({
        text: `SELECT
          ${SelectQuery.query.select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${SelectQuery.query.where}
        GROUP BY lucid_pages.id
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
        values: SelectQuery.values,
    });
    const count = await client.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${SelectQuery.query.where}
        `,
        values: SelectQuery.countValues,
    });
    pages.rows.forEach((page) => {
        page = (0, format_page_1.default)(page);
    });
    return {
        data: pages.rows,
        count: count.rows[0].count,
    };
};
Page.getSingle = async (query, data) => {
    const client = await db_1.default;
    const { include } = query;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
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
            data: {
                id: data.id.toString(),
                environment_key: data.environment_key,
            },
            meta: {
                id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: undefined,
        page: undefined,
        per_page: undefined,
    });
    const page = await client.query({
        text: `SELECT
        ${SelectQuery.query.select},
        COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${SelectQuery.query.where}
        GROUP BY lucid_pages.id`,
        values: SelectQuery.values,
    });
    if (page.rows.length === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page not found",
            message: `Page with id "${data.id}" not found`,
            status: 404,
        });
    }
    if (include && include.includes("bricks")) {
        const collection = await collections_1.default.getSingle({
            collection_key: page.rows[0].collection_key,
            environment_key: page.rows[0].environment_key,
            type: "pages",
        });
        const pageBricks = await collection_bricks_1.default.getAll({
            reference_id: page.rows[0].id,
            type: "pages",
            environment_key: data.environment_key,
            collection: collection,
        });
        page.rows[0].builder_bricks = pageBricks.builder_bricks;
        page.rows[0].fixed_bricks = pageBricks.fixed_bricks;
    }
    return (0, format_page_1.default)(page.rows[0]);
};
Page.createSingle = async (data) => {
    const client = await db_1.default;
    await collections_1.default.getSingle({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        type: "pages",
    });
    const parentId = data.homepage ? undefined : data.parent_id;
    if (parentId) {
        await pages_1.default.parentChecks({
            parent_id: parentId,
            environment_key: data.environment_key,
            collection_key: data.collection_key,
        });
    }
    const slug = await pages_1.default.buildUniqueSlug({
        slug: data.slug,
        homepage: data.homepage || false,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        parent_id: parentId,
    });
    const page = await client.query({
        text: `INSERT INTO lucid_pages (environment_key, title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        values: [
            data.environment_key,
            data.title,
            slug,
            data.homepage || false,
            data.collection_key,
            data.excerpt || null,
            data.published || false,
            parentId,
            data.userId,
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
        await page_categories_1.default.createMultiple({
            page_id: page.rows[0].id,
            category_ids: data.category_ids,
            collection_key: data.collection_key,
        });
    }
    if (data.homepage) {
        await pages_1.default.resetHomepages({
            current: page.rows[0].id,
            environment_key: data.environment_key,
        });
    }
    return (0, format_page_1.default)(page.rows[0]);
};
Page.updateSingle = async (data) => {
    const client = await db_1.default;
    const currentPage = await pages_1.default.checkPageExists({
        id: data.id,
        environment_key: data.environment_key,
    });
    const parentId = data.homepage ? undefined : data.parent_id;
    if (parentId) {
        await pages_1.default.parentChecks({
            parent_id: parentId,
            environment_key: data.environment_key,
            collection_key: currentPage.collection_key,
        });
    }
    const environment = await environments_1.default.getSingle({
        key: data.environment_key,
    });
    const collection = await collections_1.default.getSingle({
        collection_key: currentPage.collection_key,
        environment_key: data.environment_key,
        type: "pages",
    });
    await collection_bricks_1.default.validateBricks({
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    let newSlug = undefined;
    if (data.slug) {
        newSlug = await pages_1.default.buildUniqueSlug({
            slug: data.slug,
            homepage: data.homepage || false,
            environment_key: data.environment_key,
            collection_key: currentPage.collection_key,
            parent_id: parentId,
        });
    }
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "title",
            "slug",
            "excerpt",
            "published",
            "published_at",
            "published_by",
            "parent_id",
            "homepage",
        ],
        values: [
            data.title,
            newSlug,
            data.excerpt,
            data.published,
            data.published ? new Date() : null,
            data.published ? data.userId : null,
            parentId,
            data.homepage,
        ],
        conditional: {
            hasValues: {
                updated_at: new Date().toISOString(),
            },
        },
    });
    const page = await client.query({
        text: `UPDATE lucid_pages SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING *`,
        values: [...values.value, data.id],
    });
    if (!page.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Not Updated",
            message: "There was an error updating the page",
            status: 500,
        });
    }
    if (data.category_ids) {
        const categories = await page_categories_1.default.updateMultiple({
            page_id: page.rows[0].id,
            category_ids: data.category_ids,
            collection_key: currentPage.collection_key,
        });
        page.rows[0].categories = categories.map((category) => category.category_id);
    }
    await collection_bricks_1.default.updateMultiple({
        id: page.rows[0].id,
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    return (0, format_page_1.default)(page.rows[0]);
};
Page.deleteSingle = async (data) => {
    const client = await db_1.default;
    await pages_1.default.checkPageExists({
        id: data.id,
        environment_key: data.environment_key,
    });
    const page = await client.query({
        text: `DELETE FROM lucid_pages WHERE id = $1 RETURNING *`,
        values: [data.id],
    });
    if (!page.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Not Deleted",
            message: "There was an error deleting the page",
            status: 500,
        });
    }
    return (0, format_page_1.default)(page.rows[0]);
};
Page.getMultipleByIds = async (data) => {
    const client = await db_1.default;
    const pages = await client.query({
        text: `SELECT * FROM lucid_pages WHERE id = ANY($1) AND environment_key = $2`,
        values: [data.ids, data.environment_key],
    });
    return pages.rows.map((page) => (0, format_page_1.default)(page));
};
Page.getSingleBasic = async (id, environment_key) => {
    const client = await db_1.default;
    const page = await client.query({
        text: `SELECT
          *
        FROM
          lucid_pages
        WHERE
          id = $1
        AND
          environment_key = $2`,
        values: [id, environment_key],
    });
    return page.rows[0];
};
Page.getSlugCount = async (data) => {
    const client = await db_1.default;
    const values = [
        data.slug,
        data.collection_key,
        data.environment_key,
    ];
    if (data.parent_id)
        values.push(data.parent_id);
    const slugCount = await client.query({
        text: `SELECT COUNT(*) 
        FROM 
          lucid_pages 
        WHERE slug ~ '^${data.slug}-\\d+$' 
        OR 
          slug = $1
        AND
          collection_key = $2
        AND
          environment_key = $3
        ${data.parent_id ? `AND parent_id = $4` : `AND parent_id IS NULL`}`,
        values: values,
    });
    return slugCount.rows[0].count;
};
Page.getNonCurrentHomepages = async (currentId, environment_key) => {
    const client = await db_1.default;
    const result = await client.query({
        text: `SELECT id, title FROM lucid_pages WHERE homepage = true AND id != $1 AND environment_key = $2`,
        values: [currentId, environment_key],
    });
    return result.rows;
};
Page.checkSlugExistence = async (slug, id, environment_key) => {
    const client = await db_1.default;
    const slugExists = await client.query({
        text: `SELECT COUNT(*) FROM lucid_pages WHERE slug = $1 AND id != $2 AND environment_key = $3`,
        values: [slug, id, environment_key],
    });
    return slugExists.rows[0].count > 0;
};
Page.updatePageToNonHomepage = async (id, newSlug) => {
    const client = await db_1.default;
    await client.query({
        text: `UPDATE lucid_pages SET homepage = false, parent_id = null, slug = $2 WHERE id = $1`,
        values: [id, newSlug],
    });
};
exports.default = Page;
//# sourceMappingURL=Page.js.map