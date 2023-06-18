"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Group_getOrCreateGroup;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const Collection_1 = __importDefault(require("../models/Collection"));
const BrickData_1 = __importDefault(require("../models/BrickData"));
const error_handler_1 = require("../../utils/error-handler");
const query_helpers_1 = require("../../utils/query-helpers");
class Group {
}
_a = Group;
Group.getSingle = async (environment_key, collection_key) => {
    const collection = await Collection_1.default.getSingle(collection_key, "group", environment_key);
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
            "collection_key",
            "created_at",
            "updated_at",
            "updated_by",
        ],
        exclude: undefined,
        filter: {
            data: {
                collection_key: collection_key,
                environment_key: environment_key,
            },
            meta: {
                collection_key: {
                    operator: "=",
                    type: "string",
                    columnType: "standard",
                },
                environment_key: {
                    operator: "=",
                    type: "string",
                    columnType: "standard",
                },
            },
        },
        sort: undefined,
        page: undefined,
        per_page: undefined,
    });
    const group = await db_1.default.query({
        text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_groups
        ${SelectQuery.query.where}`,
        values: SelectQuery.values,
    });
    if (group.rows.length === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Group Error",
            message: "We could not find the group you are looking for!",
            status: 404,
        });
    }
    const pageBricks = await BrickData_1.default.getAll("group", group.rows[0].id, environment_key, collection);
    group.rows[0].bricks = pageBricks || [];
    return group.rows[0];
};
Group.updateSingle = async (userId, environment_key, collection_key, bricks) => {
    await Collection_1.default.getSingle(collection_key, "group", environment_key);
    const group = await __classPrivateFieldGet(Group, _a, "f", _Group_getOrCreateGroup).call(Group, environment_key, collection_key);
    const brickPromises = bricks.map((brick, index) => BrickData_1.default.createOrUpdate(brick, index, "group", group.id)) || [];
    const pageBricksIds = await Promise.all(brickPromises);
    await BrickData_1.default.deleteUnused("group", group.id, pageBricksIds);
    const updatedGroup = await db_1.default.query({
        text: `UPDATE lucid_groups SET updated_by = $1 WHERE id = $2 RETURNING *`,
        values: [userId, group.id],
    });
    return updatedGroup.rows[0];
};
_Group_getOrCreateGroup = { value: async (environment_key, collection_key) => {
        try {
            const group = await db_1.default.query({
                text: `SELECT * FROM lucid_groups WHERE environment_key = $1 AND collection_key = $2`,
                values: [environment_key, collection_key],
            });
            if (group.rows.length === 0) {
                const newGroup = await db_1.default.query({
                    text: `INSERT INTO lucid_groups (environment_key, collection_key) VALUES ($1, $2) RETURNING *`,
                    values: [environment_key, collection_key],
                });
                return newGroup.rows[0];
            }
            else
                return group.rows[0];
        }
        catch (err) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Group Error",
                message: "There was an error getting or creating the group",
                status: 500,
            });
        }
    } };
exports.default = Group;
//# sourceMappingURL=Group.js.map