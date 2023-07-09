"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Media_getStorageUsed, _Media_setStorageUsed, _Media_canStoreFiles, _Media_saveFile, _Media_deleteFile;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const client_s3_1 = require("@aws-sdk/client-s3");
const Config_1 = __importDefault(require("../models/Config"));
const Option_1 = __importDefault(require("../models/Option"));
const s3_client_1 = __importDefault(require("../../utils/media/s3-client"));
const helpers_1 = __importDefault(require("../../utils/media/helpers"));
const format_media_1 = __importDefault(require("../../utils/media/format-media"));
const error_handler_1 = require("../../utils/app/error-handler");
const query_helpers_1 = require("../../utils/app/query-helpers");
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
    const canStoreRes = await __classPrivateFieldGet(Media, _a, "f", _Media_canStoreFiles).call(Media, files);
    if (!canStoreRes.can) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: canStoreRes.message,
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                file: {
                    code: "storage_limit",
                    message: canStoreRes.message,
                },
            }),
        });
    }
    const key = helpers_1.default.uniqueKey(name || firstFile.name);
    const meta = await helpers_1.default.getMetaData(firstFile);
    const response = await __classPrivateFieldGet(Media, _a, "f", _Media_saveFile).call(Media, key, firstFile, meta);
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
        await __classPrivateFieldGet(Media, _a, "f", _Media_deleteFile).call(Media, key);
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
    await __classPrivateFieldGet(Media, _a, "f", _Media_setStorageUsed).call(Media, meta.size);
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
    await __classPrivateFieldGet(Media, _a, "f", _Media_deleteFile).call(Media, key);
    await __classPrivateFieldGet(Media, _a, "f", _Media_setStorageUsed).call(Media, 0, media.rows[0].file_size);
    return (0, format_media_1.default)(media.rows[0]);
};
Media.updateSingle = async (key, data) => {
    const client = await db_1.default;
    const media = await Media.getSingle(key);
    let meta = undefined;
    if (data.files && data.files["file"]) {
        const files = helpers_1.default.formatReqFiles(data.files);
        const firstFile = files[0];
        const canStoreRes = await __classPrivateFieldGet(Media, _a, "f", _Media_canStoreFiles).call(Media, files);
        if (!canStoreRes.can) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Error saving file",
                message: canStoreRes.message,
                status: 500,
                errors: (0, error_handler_1.modelErrors)({
                    file: {
                        code: "storage_limit",
                        message: canStoreRes.message,
                    },
                }),
            });
        }
        meta = await helpers_1.default.getMetaData(firstFile);
        const response = await __classPrivateFieldGet(Media, _a, "f", _Media_saveFile).call(Media, key, firstFile, meta);
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
        await __classPrivateFieldGet(Media, _a, "f", _Media_setStorageUsed).call(Media, meta.size, media.meta.file_size);
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
_Media_getStorageUsed = { value: async () => {
        const res = await Option_1.default.getByName("media_storage_used");
        return res.option_value;
    } };
_Media_setStorageUsed = { value: async (add, minus) => {
        const storageUsed = await __classPrivateFieldGet(Media, _a, "f", _Media_getStorageUsed).call(Media);
        let newValue = storageUsed + add;
        if (minus !== undefined) {
            newValue = newValue - minus;
        }
        const res = await Option_1.default.patchByName({
            name: "media_storage_used",
            value: newValue,
            type: "number",
        });
        return res.option_value;
    } };
_Media_canStoreFiles = { value: async (files) => {
        const { storageLimit, maxFileSize } = Config_1.default.media;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > maxFileSize) {
                return {
                    can: false,
                    message: `File ${file.name} is too large. Max file size is ${maxFileSize} bytes.`,
                };
            }
        }
        const storageUsed = await __classPrivateFieldGet(Media, _a, "f", _Media_getStorageUsed).call(Media);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        if (totalSize + storageUsed > storageLimit) {
            return {
                can: false,
                message: `Files exceed storage limit. Max storage limit is ${storageLimit} bytes.`,
            };
        }
        return { can: true };
    } };
_Media_saveFile = { value: async (key, file, meta) => {
        const S3 = await s3_client_1.default;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: Config_1.default.media.store.bucket,
            Key: key,
            Body: file.data,
            ContentType: meta.mimeType,
            Metadata: {
                width: meta.width?.toString() || "",
                height: meta.height?.toString() || "",
                extension: meta.fileExtension,
            },
        });
        return S3.send(command);
    } };
_Media_deleteFile = { value: async (key) => {
        const S3 = await s3_client_1.default;
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: Config_1.default.media.store.bucket,
            Key: key,
        });
        return S3.send(command);
    } };
exports.default = Media;
//# sourceMappingURL=Media.js.map