"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
class ProcessedImage {
}
_a = ProcessedImage;
ProcessedImage.createSingle = async (client, data) => {
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["key", "media_key"],
        values: [data.key, data.media_key],
    });
    const processedImage = await client.query({
        text: `INSERT INTO lucid_processed_images (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING key`,
        values: values.value,
    });
    return processedImage.rows[0];
};
ProcessedImage.getAllByMediaKey = async (client, data) => {
    const processedImages = await client.query({
        text: `SELECT * FROM lucid_processed_images WHERE media_key = $1`,
        values: [data.media_key],
    });
    return processedImages.rows;
};
ProcessedImage.deleteAllByMediaKey = async (client, data) => {
    const processedImages = await client.query({
        text: `DELETE FROM lucid_processed_images WHERE media_key = $1`,
        values: [data.media_key],
    });
    return processedImages.rows;
};
ProcessedImage.getAll = async (client) => {
    const processedImages = await client.query({
        text: `SELECT * FROM lucid_processed_images`,
    });
    return processedImages.rows;
};
ProcessedImage.deleteAll = async (client) => {
    const processedImages = await client.query({
        text: `DELETE FROM lucid_processed_images`,
    });
    return processedImages.rows;
};
ProcessedImage.getAllByMediaKeyCount = async (client, data) => {
    const processedImages = await client.query({
        text: `SELECT COUNT(*) FROM lucid_processed_images WHERE media_key = $1`,
        values: [data.media_key],
    });
    return Number(processedImages.rows[0].count);
};
ProcessedImage.getAllCount = async (client) => {
    const processedImages = await client.query({
        text: `SELECT COUNT(*) FROM lucid_processed_images`,
    });
    return Number(processedImages.rows[0].count);
};
exports.default = ProcessedImage;
//# sourceMappingURL=ProcessedImage.js.map