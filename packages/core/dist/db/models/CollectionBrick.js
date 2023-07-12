"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
const generate_field_query_1 = __importDefault(require("../../utils/bricks/generate-field-query"));
class CollectionBrick {
}
_a = CollectionBrick;
CollectionBrick.getAll = async (data) => {
    const client = await db_1.default;
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";
    const brickFields = await client.query(`SELECT 
          lucid_collection_bricks.*,
          lucid_fields.*,
          json_build_object(
            'title', lucid_pages.title,
            'slug', lucid_pages.slug,
            'full_slug', lucid_pages.full_slug
          ) as linked_page,
          json_build_object(
            'key', lucid_media.key,
            'mime_type', lucid_media.mime_type,
            'file_extension', lucid_media.file_extension,
            'file_size', lucid_media.file_size,
            'width', lucid_media.width,
            'height', lucid_media.height,
            'name', lucid_media.name,
            'alt', lucid_media.alt
          ) as media
        FROM 
          lucid_collection_bricks
        LEFT JOIN 
          lucid_fields
        ON 
          lucid_collection_bricks.id = lucid_fields.collection_brick_id
        LEFT JOIN 
          lucid_pages
        ON 
          lucid_fields.page_link_id = lucid_pages.id
        LEFT JOIN 
          lucid_media
        ON 
          lucid_fields.media_id = lucid_media.id
        WHERE 
          lucid_collection_bricks.${referenceKey} = $1
        ORDER BY 
          lucid_collection_bricks.brick_order`, [data.reference_id]);
    return brickFields.rows;
};
CollectionBrick.createSingleBrick = async (data) => {
    const client = await db_1.default;
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";
    const brickRes = await client.query(`INSERT INTO 
        lucid_collection_bricks (brick_key, brick_type, ${referenceKey}, brick_order) 
      VALUES 
        ($1, $2, $3, $4)
      RETURNING *`, [data.brick.key, data.brick_type, data.reference_id, data.order]);
    return brickRes.rows[0];
};
CollectionBrick.updateSingleBrick = async (data) => {
    const client = await db_1.default;
    const brickRes = await client.query(`UPDATE 
        lucid_collection_bricks 
      SET 
        brick_order = $1
      WHERE 
        id = $2
      AND
        brick_type = $3
      RETURNING *`, [data.order, data.brick.id, data.brick_type]);
    return brickRes.rows[0];
};
CollectionBrick.getAllBricks = async (type, reference_id, brick_type) => {
    const client = await db_1.default;
    const referenceKey = type === "pages" ? "page_id" : "singlepage_id";
    const collectionBrickIds = await client.query({
        text: `SELECT id FROM lucid_collection_bricks WHERE ${referenceKey} = $1 AND brick_type = $2 RETURNING *`,
        values: [reference_id, brick_type],
    });
    return collectionBrickIds.rows;
};
CollectionBrick.deleteSingleBrick = async (id) => {
    const client = await db_1.default;
    const brickRes = await client.query({
        text: `DELETE FROM lucid_collection_bricks WHERE id = $1 RETURNING *`,
        values: [id],
    });
    return brickRes.rows[0];
};
CollectionBrick.updateField = async (brick_id, data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, generate_field_query_1.default)({
        brick_id: brick_id,
        data: data,
        mode: "update",
    });
    const fieldRes = await client.query({
        text: `UPDATE lucid_fields SET ${columns.formatted.update} WHERE fields_id = $${aliases.value.length + 1} RETURNING *`,
        values: [...values.value, data.fields_id],
    });
    return fieldRes.rows[0];
};
CollectionBrick.createField = async (brick_id, data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, generate_field_query_1.default)({
        brick_id: brick_id,
        data: data,
        mode: "create",
    });
    const fieldRes = await client.query({
        text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return fieldRes.rows[0];
};
CollectionBrick.checkFieldExists = async (data) => {
    const client = await db_1.default;
    let queryText = "SELECT EXISTS(SELECT 1 FROM lucid_fields WHERE collection_brick_id = $1 AND key = $2 AND type = $3";
    let queryValues = [data.brick_id, data.key, data.type];
    if (data.parent_repeater !== undefined) {
        queryText += " AND parent_repeater = $4";
        queryValues.push(data.parent_repeater);
    }
    if (data.group_position !== undefined) {
        queryText += " AND group_position = $5";
        queryValues.push(data.group_position);
    }
    queryText += ")";
    const res = await client.query({
        text: queryText,
        values: queryValues,
    });
    return res.rows[0].exists;
};
CollectionBrick.updateRepeater = async (data) => {
    const client = await db_1.default;
    const repeaterRes = await client.query({
        text: `UPDATE lucid_fields SET group_position = $1 WHERE fields_id = $2 RETURNING *`,
        values: [data.group_position, data.fields_id],
    });
    return repeaterRes.rows[0];
};
CollectionBrick.createRepeater = async (brick_id, data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "collection_brick_id",
            "key",
            "type",
            "parent_repeater",
            "group_position",
        ],
        values: [
            brick_id,
            data.key,
            data.type,
            data.parent_repeater,
            data.group_position,
        ],
    });
    const repeaterRes = await client.query({
        text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING fields_id`,
        values: values.value,
    });
    return repeaterRes.rows[0];
};
exports.default = CollectionBrick;
//# sourceMappingURL=CollectionBrick.js.map