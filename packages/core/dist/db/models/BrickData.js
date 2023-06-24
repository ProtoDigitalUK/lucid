"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _BrickData_createSinglePageBrick, _BrickData_updateSinglePageBrick, _BrickData_upsertField, _BrickData_checkFieldExists, _BrickData_fieldTypeSpecificQueryData, _BrickData_upsertRepeater, _BrickData_valueKey;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
const query_helpers_1 = require("../../utils/query-helpers");
const format_bricks_1 = __importDefault(require("../../services/bricks/format-bricks"));
const BrickConfig_1 = __importDefault(require("../models/BrickConfig"));
class BrickData {
}
_a = BrickData;
BrickData.createOrUpdate = async (data) => {
    const promises = [];
    const allowed = BrickConfig_1.default.isBrickAllowed(data.brick.key, {
        environment: data.environment,
        collection: data.collection,
    }, data.brick_type);
    if (!allowed.allowed) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not allowed",
            message: `The brick "${data.brick.key}" of type "${data.brick_type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
            status: 500,
        });
    }
    const brickId = data.brick.id
        ? await __classPrivateFieldGet(BrickData, _a, "f", _BrickData_updateSinglePageBrick).call(BrickData, {
            order: data.order,
            brick: data.brick,
            brick_type: data.brick_type,
        })
        : await __classPrivateFieldGet(BrickData, _a, "f", _BrickData_createSinglePageBrick).call(BrickData, {
            type: data.collection_type,
            reference_id: data.reference_id,
            order: data.order,
            brick: data.brick,
            brick_type: data.brick_type,
        });
    if (!data.brick.fields)
        return brickId;
    for (const field of data.brick.fields) {
        if (field.type === "tab")
            continue;
        if (field.type === "repeater")
            promises.push(__classPrivateFieldGet(BrickData, _a, "f", _BrickData_upsertRepeater).call(BrickData, brickId, field));
        else
            promises.push(__classPrivateFieldGet(BrickData, _a, "f", _BrickData_upsertField).call(BrickData, brickId, field));
    }
    await Promise.all(promises);
    return brickId;
};
BrickData.getAll = async (data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";
    const brickFields = await db_1.default.query(`SELECT 
      lucid_collection_bricks.*,
        lucid_fields.*,
        lucid_pages.title as linked_page_title,
        lucid_pages.slug as linked_page_slug,
        lucid_pages.full_slug as linked_page_full_slug
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
      WHERE 
        lucid_collection_bricks.${referenceKey} = $1
      ORDER BY 
        lucid_collection_bricks.brick_order`, [data.reference_id]);
    if (!brickFields.rows[0]) {
        return {
            builder_bricks: [],
            fixed_bricks: [],
        };
    }
    const formmatedBricks = await (0, format_bricks_1.default)(brickFields.rows, data.environment_key, data.collection);
    return {
        builder_bricks: formmatedBricks.filter((brick) => brick.type === "builder"),
        fixed_bricks: formmatedBricks.filter((brick) => brick.type !== "builder"),
    };
};
BrickData.deleteUnused = async (data) => {
    const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";
    const pageBrickIds = await db_1.default.query({
        text: `SELECT id FROM lucid_collection_bricks WHERE ${referenceKey} = $1 AND brick_type = $2`,
        values: [data.reference_id, data.brick_type],
    });
    const bricksToDelete = pageBrickIds.rows.filter((brick) => !data.brick_ids.includes(brick.id));
    const promises = bricksToDelete.map((brick) => db_1.default.query({
        text: `DELETE FROM lucid_collection_bricks WHERE id = $1`,
        values: [brick.id],
    }));
    try {
        await Promise.all(promises);
    }
    catch (err) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick Delete Error",
            message: `There was an error deleting bricks for "${data.type}" of ID "${data.reference_id}"!`,
            status: 500,
        });
    }
};
_BrickData_createSinglePageBrick = { value: async (data) => {
        const referenceKey = data.type === "pages" ? "page_id" : "singlepage_id";
        const brickRes = await db_1.default.query(`INSERT INTO 
        lucid_collection_bricks (brick_key, brick_type, ${referenceKey}, brick_order) 
      VALUES 
        ($1, $2, $3, $4)
      RETURNING id`, [data.brick.key, data.brick_type, data.reference_id, data.order]);
        if (!brickRes.rows[0]) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Page Brick Create Error",
                message: "Could not create page brick",
                status: 500,
            });
        }
        return brickRes.rows[0].id;
    } };
_BrickData_updateSinglePageBrick = { value: async (data) => {
        const brickRes = await db_1.default.query(`UPDATE 
        lucid_collection_bricks 
      SET 
        brick_order = $1
      WHERE 
        id = $2
      AND
        brick_type = $3
      RETURNING id`, [data.order, data.brick.id, data.brick_type]);
        if (!brickRes.rows[0]) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Page Brick Update Error",
                message: "Could not update page brick",
                status: 500,
            });
        }
        return brickRes.rows[0].id;
    } };
_BrickData_upsertField = { value: async (brick_id, data) => {
        let fieldId;
        if (data.fields_id) {
            const { columns, aliases, values } = __classPrivateFieldGet(BrickData, _a, "f", _BrickData_fieldTypeSpecificQueryData).call(BrickData, brick_id, data, "update");
            const fieldRes = await db_1.default.query({
                text: `UPDATE lucid_fields SET ${columns.formatted.update} WHERE fields_id = $${aliases.value.length + 1} RETURNING fields_id`,
                values: [...values.value, data.fields_id],
            });
            fieldId = fieldRes.rows[0].fields_id;
        }
        else {
            const fieldExists = await __classPrivateFieldGet(BrickData, _a, "f", _BrickData_checkFieldExists).call(BrickData, {
                brick_id: brick_id,
                key: data.key,
                type: data.type,
                parent_repeater: data.parent_repeater,
                group_position: data.group_position,
            });
            if (fieldExists) {
                throw new error_handler_1.LucidError({
                    type: "basic",
                    name: "Field Create Error",
                    message: `Could not create field "${data.key}" for page brick "${brick_id}". Field already exists.`,
                    status: 409,
                });
            }
            const { columns, aliases, values } = __classPrivateFieldGet(BrickData, _a, "f", _BrickData_fieldTypeSpecificQueryData).call(BrickData, brick_id, data, "create");
            const fieldRes = await db_1.default.query({
                text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING fields_id`,
                values: values.value,
            });
            if (!fieldRes.rows[0]) {
                throw new error_handler_1.LucidError({
                    type: "basic",
                    name: "Field Create Error",
                    message: `Could not create field "${data.key}" for brick "${brick_id}".`,
                    status: 500,
                });
            }
            fieldId = fieldRes.rows[0].fields_id;
        }
        return fieldId;
    } };
_BrickData_checkFieldExists = { value: async (data) => {
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
        const res = await db_1.default.query({
            text: queryText,
            values: queryValues,
        });
        return res.rows[0].exists;
    } };
_BrickData_fieldTypeSpecificQueryData = { value: (brick_id, data, mode) => {
        switch (data.type) {
            case "link": {
                if (mode === "create") {
                    return (0, query_helpers_1.queryDataFormat)([
                        "collection_brick_id",
                        "key",
                        "type",
                        "text_value",
                        "json_value",
                        "parent_repeater",
                        "group_position",
                    ], [
                        brick_id,
                        data.key,
                        data.type,
                        data.value,
                        {
                            target: data.target,
                        },
                        data.parent_repeater,
                        data.group_position,
                    ]);
                }
                else {
                    return (0, query_helpers_1.queryDataFormat)(["text_value", "json_value", "group_position"], [
                        data.value,
                        {
                            target: data.target,
                        },
                        data.group_position,
                    ]);
                }
            }
            case "pagelink": {
                if (mode === "create") {
                    return (0, query_helpers_1.queryDataFormat)([
                        "collection_brick_id",
                        "key",
                        "type",
                        "page_link_id",
                        "json_value",
                        "parent_repeater",
                        "group_position",
                    ], [
                        brick_id,
                        data.key,
                        data.type,
                        data.value,
                        {
                            target: data.target,
                        },
                        data.parent_repeater,
                        data.group_position,
                    ]);
                }
                else {
                    return (0, query_helpers_1.queryDataFormat)(["page_link_id", "json_value", "group_position"], [
                        data.value,
                        {
                            target: data.target,
                        },
                        data.group_position,
                    ]);
                }
            }
            default: {
                if (mode === "create") {
                    return (0, query_helpers_1.queryDataFormat)([
                        "collection_brick_id",
                        "key",
                        "type",
                        __classPrivateFieldGet(BrickData, _a, "f", _BrickData_valueKey).call(BrickData, data.type),
                        "parent_repeater",
                        "group_position",
                    ], [
                        brick_id,
                        data.key,
                        data.type,
                        data.value,
                        data.parent_repeater,
                        data.group_position,
                    ]);
                }
                else {
                    return (0, query_helpers_1.queryDataFormat)([__classPrivateFieldGet(BrickData, _a, "f", _BrickData_valueKey).call(BrickData, data.type), "group_position"], [data.value, data.group_position]);
                }
            }
        }
    } };
_BrickData_upsertRepeater = { value: async (brick_id, data) => {
        let repeaterId;
        if (data.fields_id && data.group_position !== undefined) {
            const repeaterRes = await db_1.default.query({
                text: `UPDATE lucid_fields SET group_position = $1 WHERE fields_id = $2 RETURNING fields_id`,
                values: [data.group_position, data.fields_id],
            });
            repeaterId = repeaterRes.rows[0].fields_id;
        }
        else {
            const repeaterExists = await __classPrivateFieldGet(BrickData, _a, "f", _BrickData_checkFieldExists).call(BrickData, {
                brick_id: brick_id,
                key: data.key,
                type: data.type,
                parent_repeater: data.parent_repeater,
                group_position: data.group_position,
            });
            if (repeaterExists) {
                throw new error_handler_1.LucidError({
                    type: "basic",
                    name: "Repeater Create Error",
                    message: `A repeater with the same collection_brick_id, key, and parent_repeater already exists.`,
                    status: 409,
                });
            }
            const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)([
                "collection_brick_id",
                "key",
                "type",
                "parent_repeater",
                "group_position",
            ], [
                brick_id,
                data.key,
                data.type,
                data.parent_repeater,
                data.group_position,
            ]);
            const repeaterRes = await db_1.default.query({
                text: `INSERT INTO lucid_fields (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING fields_id`,
                values: values.value,
            });
            repeaterId = repeaterRes.rows[0].fields_id;
        }
        if (!data.items)
            return;
        const promises = [];
        for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i];
            if (item.type === "tab")
                continue;
            item.parent_repeater = repeaterId;
            if (item.type === "repeater") {
                promises.push(__classPrivateFieldGet(BrickData, _a, "f", _BrickData_upsertRepeater).call(BrickData, brick_id, item));
                continue;
            }
            promises.push(__classPrivateFieldGet(BrickData, _a, "f", _BrickData_upsertField).call(BrickData, brick_id, item));
        }
        await Promise.all(promises);
    } };
_BrickData_valueKey = { value: (type) => {
        switch (type) {
            case "text":
                return "text_value";
            case "wysiwyg":
                return "text_value";
            case "image":
                return "media_id";
            case "file":
                return "media_id";
            case "number":
                return "int_value";
            case "checkbox":
                return "bool_value";
            case "select":
                return "text_value";
            case "textarea":
                return "text_value";
            case "json":
                return "json_value";
            case "pagelink":
                return "page_link_id";
            case "link":
                return "text_value";
            case "datetime":
                return "text_value";
            case "colour":
                return "text_value";
            default:
                return "text_value";
        }
    } };
exports.default = BrickData;
//# sourceMappingURL=BrickData.js.map