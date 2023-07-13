"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
class Media {
}
_a = Media;
Media.createSingle = async (data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "key",
            "e_tag",
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
Media.getMultiple = async (query_instance) => {
    const client = await db_1.default;
    const mediasRes = client.query({
        text: `SELECT${query_instance.query.select}FROMlucid_media${query_instance.query.where}${query_instance.query.order}${query_instance.query.pagination}`,
        values: query_instance.values,
    });
    const count = client.query({
        text: `SELECT COUNT(DISTINCT lucid_media.id)FROMlucid_media${query_instance.query.where} `,
        values: query_instance.countValues,
    });
    const data = await Promise.all([mediasRes, count]);
    return {
        data: data[0].rows,
        count: data[1].rows[0].count,
    };
};
Media.getSingle = async (key) => {
    const client = await db_1.default;
    const media = await client.query({
        text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          key = $1`,
        values: [key],
    });
    return media.rows[0];
};
Media.getSingleById = async (id) => {
    const client = await db_1.default;
    const media = await client.query({
        text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = $1`,
        values: [id],
    });
    return media.rows[0];
};
Media.deleteSingle = async (key) => {
    const client = await db_1.default;
    const media = await client.query({
        text: `DELETE FROM
          lucid_media
        WHERE
          key = $1
        RETURNING *`,
        values: [key],
    });
    return media.rows[0];
};
Media.updateSingle = async (key, data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "name",
            "alt",
            "mime_type",
            "file_extension",
            "file_size",
            "width",
            "height",
        ],
        values: [
            data.name,
            data.alt,
            data.meta?.mimeType,
            data.meta?.fileExtension,
            data.meta?.size,
            data.meta?.width,
            data.meta?.height,
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
          RETURNING *`,
        values: [...values.value, key],
    });
    return mediaRes.rows[0];
};
Media.getMultipleByIds = async (ids) => {
    const client = await db_1.default;
    const media = await client.query({
        text: `SELECT
          *
        FROM
          lucid_media
        WHERE
          id = ANY($1)`,
        values: [ids],
    });
    return media.rows;
};
exports.default = Media;
//# sourceMappingURL=Media.js.map