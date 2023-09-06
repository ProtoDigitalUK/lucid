"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_js_1 = require("../../utils/app/query-helpers.js");
class ProcessedImage {
    static createSingle = async (client, data) => {
        const { columns, aliases, values } = (0, query_helpers_js_1.queryDataFormat)({
            columns: ["key", "media_key"],
            values: [data.key, data.media_key],
        });
        const processedImage = await client.query({
            text: `INSERT INTO lucid_processed_images (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING key`,
            values: values.value,
        });
        return processedImage.rows[0];
    };
    static getAllByMediaKey = async (client, data) => {
        const processedImages = await client.query({
            text: `SELECT * FROM lucid_processed_images WHERE media_key = $1`,
            values: [data.media_key],
        });
        return processedImages.rows;
    };
    static deleteAllByMediaKey = async (client, data) => {
        const processedImages = await client.query({
            text: `DELETE FROM lucid_processed_images WHERE media_key = $1`,
            values: [data.media_key],
        });
        return processedImages.rows;
    };
    static getAll = async (client) => {
        const processedImages = await client.query({
            text: `SELECT * FROM lucid_processed_images`,
        });
        return processedImages.rows;
    };
    static deleteAll = async (client) => {
        const processedImages = await client.query({
            text: `DELETE FROM lucid_processed_images`,
        });
        return processedImages.rows;
    };
    static getAllByMediaKeyCount = async (client, data) => {
        const processedImages = await client.query({
            text: `SELECT COUNT(*) FROM lucid_processed_images WHERE media_key = $1`,
            values: [data.media_key],
        });
        return Number(processedImages.rows[0].count);
    };
    static getAllCount = async (client) => {
        const processedImages = await client.query({
            text: `SELECT COUNT(*) FROM lucid_processed_images`,
        });
        return Number(processedImages.rows[0].count);
    };
}
exports.default = ProcessedImage;
//# sourceMappingURL=ProcessedImage.js.map