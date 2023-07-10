"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const helpers_1 = __importDefault(require("../../utils/media/helpers"));
const format_media_1 = __importDefault(require("../../utils/media/format-media"));
const error_handler_1 = require("../../utils/app/error-handler");
const query_helpers_1 = require("../../utils/app/query-helpers");
const media_1 = __importDefault(require("../../services/media"));
const s3_1 = __importDefault(require("../../services/s3"));
class Media {
}
_a = Media;
Media.createSingle = async (data) => {
    const client = await db_1.default;
    const { name, alt } = data;
    if (!data.files || !data.files["file"]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "No files provided",
            message: "No files provided",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
                file: {
                    code: "required",
                    message: "No files provided",
                },
            }),
        });
    }
    const files = helpers_1.default.formatReqFiles(data.files);
    const firstFile = files[0];
    await media_1.default.canStoreFiles({
        files,
    });
    const key = helpers_1.default.uniqueKey(name || firstFile.name);
    const meta = await helpers_1.default.getMetaData(firstFile);
    const response = await s3_1.default.saveFile({
        key: key,
        file: firstFile,
        meta,
    });
    if (response.$metadata.httpStatusCode !== 200) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: "Error saving file",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                file: {
                    code: "required",
                    message: "Error saving file",
                },
            }),
        });
    }
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
            key,
            response.ETag?.replace(/"/g, ""),
            name || firstFile.name,
            alt,
            meta.mimeType,
            meta.fileExtension,
            meta.size,
            meta.width,
            meta.height,
        ],
    });
    const media = await client.query({
        text: `INSERT INTO lucid_media (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    if (media.rowCount === 0) {
        await s3_1.default.deleteFile({
            key,
        });
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: "Error saving file",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                file: {
                    code: "required",
                    message: "Error saving file",
                },
            }),
        });
    }
    await media_1.default.setStorageUsed({
        add: meta.size,
    });
    return (0, format_media_1.default)(media.rows[0]);
};
Media.getMultiple = async (query) => {
    const client = await db_1.default;
    const { filter, sort, page, per_page } = query;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "key",
            "e_tag",
            "name",
            "alt",
            "mime_type",
            "file_extension",
            "file_size",
            "width",
            "height",
            "created_at",
            "updated_at",
        ],
        filter: {
            data: filter,
            meta: {
                name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                key: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                mime_type: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                file_extension: {
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
    const medias = await client.query({
        text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_media
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
        values: SelectQuery.values,
    });
    const count = await client.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_media.id)
        FROM
          lucid_media
        ${SelectQuery.query.where} `,
        values: SelectQuery.countValues,
    });
    return {
        data: medias.rows.map((menu) => (0, format_media_1.default)(menu)),
        count: count.rows[0].count,
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
    if (media.rowCount === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Media not found",
            message: "We couldn't find the media you were looking for.",
            status: 404,
        });
    }
    return (0, format_media_1.default)(media.rows[0]);
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
    if (media.rowCount === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Media not found",
            message: "We couldn't find the media you were looking for.",
            status: 404,
        });
    }
    return (0, format_media_1.default)(media.rows[0]);
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
    if (media.rowCount === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Media not found",
            message: "Media not found",
            status: 404,
        });
    }
    await s3_1.default.deleteFile({
        key,
    });
    await media_1.default.setStorageUsed({
        add: 0,
        minus: media.rows[0].file_size,
    });
    return (0, format_media_1.default)(media.rows[0]);
};
Media.updateSingle = async (key, data) => {
    const client = await db_1.default;
    const media = await Media.getSingle(key);
    let meta = undefined;
    if (data.files && data.files["file"]) {
        const files = helpers_1.default.formatReqFiles(data.files);
        const firstFile = files[0];
        await media_1.default.canStoreFiles({
            files,
        });
        meta = await helpers_1.default.getMetaData(firstFile);
        const response = await s3_1.default.saveFile({
            key: media.key,
            file: firstFile,
            meta,
        });
        if (response.$metadata.httpStatusCode !== 200) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Error updating file",
                message: "There was an error updating the file.",
                status: 500,
                errors: (0, error_handler_1.modelErrors)({
                    file: {
                        code: "required",
                        message: "There was an error updating the file.",
                    },
                }),
            });
        }
        await media_1.default.setStorageUsed({
            add: meta.size,
            minus: media.meta.file_size,
        });
    }
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
            meta?.mimeType,
            meta?.fileExtension,
            meta?.size,
            meta?.width,
            meta?.height,
        ],
        conditional: {
            hasValues: {
                updated_at: new Date().toISOString(),
            },
        },
    });
    if (values.value.length > 0) {
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
        if (!mediaRes.rows[0]) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Error updating media",
                message: "There was an error updating the media.",
                status: 500,
            });
        }
    }
    return Media.getSingle(key);
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
    return media.rows.map((m) => (0, format_media_1.default)(m));
};
exports.default = Media;
//# sourceMappingURL=Media.js.map