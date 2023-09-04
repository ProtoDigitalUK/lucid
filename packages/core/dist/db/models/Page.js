"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
class Page {
}
_a = Page;
Page.getMultiple = async (client, query_instance) => {
    const pages = client.query({
        text: `SELECT
          ${query_instance.query.select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        GROUP BY lucid_pages.id
        ${query_instance.query.order}
        ${query_instance.query.pagination}`,
        values: query_instance.values,
    });
    const count = client.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        `,
        values: query_instance.countValues,
    });
    const data = await Promise.all([pages, count]);
    return {
        data: data[0].rows,
        count: Number(data[1].rows[0].count),
    };
};
Page.getSingle = async (client, query_instance) => {
    const page = await client.query({
        text: `SELECT
        ${query_instance.query.select},
        COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        GROUP BY lucid_pages.id`,
        values: query_instance.values,
    });
    return page.rows[0];
};
Page.createSingle = async (client, data) => {
    const page = await client.query({
        text: `INSERT INTO lucid_pages (environment_key, title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        values: [
            data.environment_key,
            data.title,
            data.slug,
            data.homepage || false,
            data.collection_key,
            data.excerpt || null,
            data.published || false,
            data.parent_id,
            data.userId,
        ],
    });
    return page.rows[0];
};
Page.updateSingle = async (client, data) => {
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
            data.slug,
            data.excerpt,
            data.published,
            data.published ? new Date() : null,
            data.published ? data.userId : null,
            data.parent_id,
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
    return page.rows[0];
};
Page.deleteSingle = async (client, data) => {
    const page = await client.query({
        text: `DELETE FROM lucid_pages WHERE id = $1 RETURNING *`,
        values: [data.id],
    });
    return page.rows[0];
};
Page.getMultipleByIds = async (client, data) => {
    const pages = await client.query({
        text: `SELECT * FROM lucid_pages WHERE id = ANY($1) AND environment_key = $2`,
        values: [data.ids, data.environment_key],
    });
    return pages.rows;
};
Page.getSingleBasic = async (client, data) => {
    const page = await client.query({
        text: `SELECT
          *
        FROM
          lucid_pages
        WHERE
          id = $1
        AND
          environment_key = $2`,
        values: [data.id, data.environment_key],
    });
    return page.rows[0];
};
Page.getSlugCount = async (client, data) => {
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
    return Number(slugCount.rows[0].count);
};
Page.getNonCurrentHomepages = async (client, data) => {
    const result = await client.query({
        text: `SELECT id, title FROM lucid_pages WHERE homepage = true AND id != $1 AND environment_key = $2`,
        values: [data.current_id, data.environment_key],
    });
    return result.rows;
};
Page.checkSlugExistence = async (client, data) => {
    const slugExists = await client.query({
        text: `SELECT COUNT(*) FROM lucid_pages WHERE slug = $1 AND id != $2 AND environment_key = $3`,
        values: [data.slug, data.id, data.environment_key],
    });
    return Number(slugExists.rows[0].count) > 0;
};
Page.updatePageToNonHomepage = async (client, data) => {
    const updateRes = await client.query({
        text: `UPDATE lucid_pages SET homepage = false, parent_id = null, slug = $2 WHERE id = $1`,
        values: [data.id, data.slug],
    });
    return updateRes.rows[0];
};
exports.default = Page;
//# sourceMappingURL=Page.js.map