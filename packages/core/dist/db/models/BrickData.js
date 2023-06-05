"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _BrickData_createSinglePageBrick, _BrickData_updateSinglePageBrick, _BrickData_upsertField, _BrickData_checkFieldExists, _BrickData_fieldTypeSpecificQueryData, _BrickData_upsertRepeater, _BrickData_valueKey, _BrickData_generateQueryData;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
class BrickData {
}
_a = BrickData;
BrickData.createOrUpdate = async (brick, order, type, referenceId) => {
    const promises = [];
    const brickId = brick.id
        ? await __classPrivateFieldGet(BrickData, _a, "f", _BrickData_updateSinglePageBrick).call(BrickData, order, brick)
        : await __classPrivateFieldGet(BrickData, _a, "f", _BrickData_createSinglePageBrick).call(BrickData, type, referenceId, order, brick);
    if (!brick.fields)
        return brickId;
    for (const field of brick.fields) {
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
BrickData.deleteUnused = async (type, referenceId, brickIds) => {
    const referenceKey = type === "page" ? "page_id" : "group_id";
    const pageBrickIds = await db_1.default.query({
        text: `SELECT id FROM lucid_page_bricks WHERE ${referenceKey} = $1`,
        values: [referenceId],
    });
    const bricksToDelete = pageBrickIds.rows.filter((brick) => !brickIds.includes(brick.id));
    const promises = bricksToDelete.map((brick) => db_1.default.query({
        text: `DELETE FROM lucid_page_bricks WHERE id = $1`,
        values: [brick.id],
    }));
    try {
        await Promise.all(promises);
    }
    catch (err) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick Delete Error",
            message: `There was an error deleting bricks for "${type}" of ID "${referenceId}"!`,
            status: 500,
        });
    }
};
_BrickData_createSinglePageBrick = { value: async (type, referenceId, order, brick) => {
        const referenceKey = type === "page" ? "page_id" : "group_id";
        const brickRes = await db_1.default.query(`INSERT INTO 
        lucid_page_bricks (brick_key, ${referenceKey}, brick_order) 
      VALUES 
        ($1, $2, $3)
      RETURNING id`, [brick.key, referenceId, order]);
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
_BrickData_updateSinglePageBrick = { value: async (order, brick) => {
        const brickRes = await db_1.default.query(`UPDATE 
        lucid_page_bricks 
      SET 
        brick_order = $1
      WHERE 
        id = $2
      RETURNING id`, [order, brick.id]);
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
_BrickData_upsertField = { value: async (brickId, data) => {
        let fieldId;
        if (data.id) {
            const { columns, aliases, values } = __classPrivateFieldGet(BrickData, _a, "f", _BrickData_fieldTypeSpecificQueryData).call(BrickData, brickId, data, "update");
            const setStatements = columns
                .map((column, i) => `${column} = ${aliases[i]}`)
                .join(", ");
            const fieldRes = await db_1.default.query({
                text: `UPDATE lucid_fields SET ${setStatements} WHERE id = $${aliases.length + 1} RETURNING id`,
                values: [...values, data.id],
            });
            fieldId = fieldRes.rows[0].id;
        }
        else {
            const fieldExists = await __classPrivateFieldGet(BrickData, _a, "f", _BrickData_checkFieldExists).call(BrickData, brickId, data.key, data.type, data.parent_repeater, data.group_position);
            if (fieldExists) {
                throw new error_handler_1.LucidError({
                    type: "basic",
                    name: "Field Create Error",
                    message: `Could not create field "${data.key}" for page brick "${brickId}". Field already exists.`,
                    status: 409,
                });
            }
            const { columns, aliases, values } = __classPrivateFieldGet(BrickData, _a, "f", _BrickData_fieldTypeSpecificQueryData).call(BrickData, brickId, data, "create");
            const fieldRes = await db_1.default.query({
                text: `INSERT INTO lucid_fields (${columns.join(", ")}) VALUES (${aliases.join(", ")}) RETURNING id`,
                values: values,
            });
            if (!fieldRes.rows[0]) {
                throw new error_handler_1.LucidError({
                    type: "basic",
                    name: "Field Create Error",
                    message: `Could not create field "${data.key}" for brick "${brickId}".`,
                    status: 500,
                });
            }
            fieldId = fieldRes.rows[0].id;
        }
        return fieldId;
    } };
_BrickData_checkFieldExists = { value: async (brickId, key, type, parent_repeater, group_position) => {
        let queryText = "SELECT EXISTS(SELECT 1 FROM lucid_fields WHERE page_brick_id = $1 AND key = $2 AND type = $3";
        let queryValues = [brickId, key, type];
        if (parent_repeater !== undefined) {
            queryText += " AND parent_repeater = $4";
            queryValues.push(parent_repeater);
        }
        if (group_position !== undefined) {
            queryText += " AND group_position = $5";
            queryValues.push(group_position);
        }
        queryText += ")";
        const res = await db_1.default.query({
            text: queryText,
            values: queryValues,
        });
        return res.rows[0].exists;
    } };
_BrickData_fieldTypeSpecificQueryData = { value: (brickId, data, mode) => {
        switch (data.type) {
            case "link": {
                if (mode === "create") {
                    return __classPrivateFieldGet(BrickData, _a, "f", _BrickData_generateQueryData).call(BrickData, [
                        "page_brick_id",
                        "key",
                        "type",
                        "text_value",
                        "json_value",
                        "parent_repeater",
                        "group_position",
                    ], [
                        brickId,
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
                    return __classPrivateFieldGet(BrickData, _a, "f", _BrickData_generateQueryData).call(BrickData, ["text_value", "json_value", "group_position"], [
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
                    return __classPrivateFieldGet(BrickData, _a, "f", _BrickData_generateQueryData).call(BrickData, [
                        "page_brick_id",
                        "key",
                        "type",
                        "page_link_id",
                        "json_value",
                        "parent_repeater",
                        "group_position",
                    ], [
                        brickId,
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
                    return __classPrivateFieldGet(BrickData, _a, "f", _BrickData_generateQueryData).call(BrickData, ["page_link_id", "json_value", "group_position"], [
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
                    return __classPrivateFieldGet(BrickData, _a, "f", _BrickData_generateQueryData).call(BrickData, [
                        "page_brick_id",
                        "key",
                        "type",
                        __classPrivateFieldGet(BrickData, _a, "f", _BrickData_valueKey).call(BrickData, data.type),
                        "parent_repeater",
                        "group_position",
                    ], [
                        brickId,
                        data.key,
                        data.type,
                        data.value,
                        data.parent_repeater,
                        data.group_position,
                    ]);
                }
                else {
                    return __classPrivateFieldGet(BrickData, _a, "f", _BrickData_generateQueryData).call(BrickData, [__classPrivateFieldGet(BrickData, _a, "f", _BrickData_valueKey).call(BrickData, data.type), "group_position"], [data.value, data.group_position]);
                }
            }
        }
    } };
_BrickData_upsertRepeater = { value: async (brickId, data) => {
        let repeaterId;
        if (data.id && data.group_position !== undefined) {
            const repeaterRes = await db_1.default.query({
                text: `UPDATE lucid_fields SET group_position = $1 WHERE id = $2 RETURNING id`,
                values: [data.group_position, data.id],
            });
            repeaterId = repeaterRes.rows[0].id;
        }
        else {
            const repeaterExists = await __classPrivateFieldGet(BrickData, _a, "f", _BrickData_checkFieldExists).call(BrickData, brickId, data.key, data.type, data.parent_repeater, data.group_position);
            if (repeaterExists) {
                throw new error_handler_1.LucidError({
                    type: "basic",
                    name: "Repeater Create Error",
                    message: `A repeater with the same page_brick_id, key, and parent_repeater already exists.`,
                    status: 409,
                });
            }
            const { columns, aliases, values } = __classPrivateFieldGet(BrickData, _a, "f", _BrickData_generateQueryData).call(BrickData, ["page_brick_id", "key", "type", "parent_repeater", "group_position"], [
                brickId,
                data.key,
                data.type,
                data.parent_repeater,
                data.group_position,
            ]);
            const repeaterRes = await db_1.default.query({
                text: `INSERT INTO lucid_fields (${columns.join(", ")}) VALUES (${aliases.join(", ")}) RETURNING id`,
                values: values,
            });
            repeaterId = repeaterRes.rows[0].id;
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
                promises.push(__classPrivateFieldGet(BrickData, _a, "f", _BrickData_upsertRepeater).call(BrickData, brickId, item));
                continue;
            }
            promises.push(__classPrivateFieldGet(BrickData, _a, "f", _BrickData_upsertField).call(BrickData, brickId, item));
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
                return "media_value";
            case "file":
                return "media_value";
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
_BrickData_generateQueryData = { value: (columns, values) => {
        if (columns.length !== values.length) {
            throw new Error("Columns and values arrays must have the same length");
        }
        const filteredData = columns
            .map((col, i) => ({ col, val: values[i] }))
            .filter((data) => data.val !== undefined);
        const keys = filteredData.map((data) => data.col);
        const realValues = filteredData.map((data) => data.val);
        const aliases = realValues.map((_, i) => `$${i + 1}`);
        return {
            columns: keys,
            aliases: aliases,
            values: realValues,
        };
    } };
exports.default = BrickData;
//# sourceMappingURL=BrickData.js.map