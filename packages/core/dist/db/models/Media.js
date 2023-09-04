"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
class Media {
}
_a = Media;
Media.createSingle = async (client, data) => {
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "key",
            "e_tag",
            "type",
            "name",
            "alt",
            "mime_type",
            "file_extension",
            "file_size",
            "width",
            "height",
        ],
        values: [
            data.key,
            data.etag,
            data.type,
            data.name,
            data.alt,
            data.meta.mimeType,
            data.meta.fileExtension,
            data.meta.size,
            data.meta.width,
            data.meta.height,
        ],
    });
    const media = await client.query({
        text: `INSERT INTO lucid_media (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return media.rows[0];
};
Media.getMultiple = async (client, query_instance) => {
    const mediasRes = client.query({
        text: `SELECT ${query_instance.query.select} FROM lucid_media ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
        values: query_instance.values,
    });
    const count = client.query({
        text: `SELECT COUNT(DISTINCT lucid_media.id) FROM lucid_media ${query_instance.query.where}`,
        values: query_instance.countValues,
    });
    const data = await Promise.all([mediasRes, count]);
    return {
        data: data[0].rows,
        count: Number(data[1].rows[0].count),
    };
};
Media.getSingle = async (client, data) => {
    const media = await client.query({
        text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          key = $1`,
        values: [data.key],
    });
    return media.rows[0];
};
Media.getSingleById = async (client, data) => {
    const media = await client.query({
        text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = $1`,
        values: [data.id],
    });
    return media.rows[0];
};
Media.deleteSingle = async (client, data) => {
    const media = await client.query({
        text: `DELETE FROM
          lucid_media
        WHERE
          key = $1
        RETURNING key, file_size`,
        values: [data.key],
    });
    return media.rows[0];
};
Media.updateSingle = async (client, data) => {
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "name",
            "alt",
            "type",
            "mime_type",
            "file_extension",
            "file_size",
            "width",
            "height",
            "key",
        ],
        values: [
            data.name,
            data.alt,
            data.type,
            data.meta?.mimeType,
            data.meta?.fileExtension,
            data.meta?.size,
            data.meta?.width,
            data.meta?.height,
            data.newKey,
        ],
        conditional: {
            hasValues: {
                updated_at: new Date().toISOString(),
            },
        },
    });
    const mediaRes = await client.query({
        text: `UPDATE 
            lucid_media 
          SET 
            ${columns.formatted.update} 
          WHERE 
            key = $${aliases.value.length + 1}
          RETURNING key`,
        values: [...values.value, data.key],
    });
    return mediaRes.rows[0];
};
Media.getMultipleByIds = async (client, data) => {
    const media = await client.query({
        text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = ANY($1)`,
        values: [data.ids],
    });
    return media.rows;
};
exports.default = Media;
//# sourceMappingURL=Media.js.map