"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _SinglePage_getOrCreateSinglePage;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const Collection_1 = __importDefault(require("../models/Collection"));
const BrickData_1 = __importDefault(require("../models/BrickData"));
const error_handler_1 = require("../../utils/error-handler");
const query_helpers_1 = require("../../utils/query-helpers");
class SinglePage {
}
_a = SinglePage;
SinglePage.getSingle = async (data) => {
    const client = await db_1.default;
    const collection = await Collection_1.default.getSingle({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        type: "singlepage",
    });
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
                collection_key: data.collection_key,
                environment_key: data.environment_key,
            },
            meta: {
                collection_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: undefined,
        page: undefined,
        per_page: undefined,
    });
    const singlepage = await client.query({
        text: `SELECT
          ${SelectQuery.query.select}
        FROM
        lucid_singlepages
        ${SelectQuery.query.where}`,
        values: SelectQuery.values,
    });
    if (singlepage.rows.length === 0) {
        const newSinglePage = await SinglePage.updateSingle({
            userId: 1,
            environment_key: data.environment_key,
            collection_key: data.collection_key,
            builder_bricks: [],
            fixed_bricks: [],
        });
        return newSinglePage;
    }
    const pageBricks = await BrickData_1.default.getAll({
        reference_id: singlepage.rows[0].id,
        type: "singlepage",
        environment_key: data.environment_key,
        collection: collection,
    });
    singlepage.rows[0].builder_bricks = pageBricks.builder_bricks;
    singlepage.rows[0].fixed_bricks = pageBricks.fixed_bricks;
    return singlepage.rows[0];
};
SinglePage.updateSingle = async (data) => {
    const client = await db_1.default;
    await Collection_1.default.getSingle({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        type: "singlepage",
    });
    const singlepage = await __classPrivateFieldGet(SinglePage, _a, "f", _SinglePage_getOrCreateSinglePage).call(SinglePage, data.environment_key, data.collection_key);
    await Collection_1.default.updateBricks({
        environment_key: data.environment_key,
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection_type: "singlepage",
        id: singlepage.id,
        collection_key: data.collection_key,
    });
    const updateSinglePage = await client.query({
        text: `UPDATE lucid_singlepages SET updated_by = $1 WHERE id = $2 RETURNING *`,
        values: [data.userId, singlepage.id],
    });
    return updateSinglePage.rows[0];
};
_SinglePage_getOrCreateSinglePage = { value: async (environment_key, collection_key) => {
        try {
            const client = await db_1.default;
            const singlepage = await client.query({
                text: `SELECT * FROM lucid_singlepages WHERE environment_key = $1 AND collection_key = $2`,
                values: [environment_key, collection_key],
            });
            if (singlepage.rows.length === 0) {
                const newSinglePage = await client.query({
                    text: `INSERT INTO lucid_singlepages (environment_key, collection_key) VALUES ($1, $2) RETURNING *`,
                    values: [environment_key, collection_key],
                });
                return newSinglePage.rows[0];
            }
            else
                return singlepage.rows[0];
        }
        catch (err) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Single Page Error",
                message: "There was an error getting or creating the single page",
                status: 500,
            });
        }
    } };
exports.default = SinglePage;
//# sourceMappingURL=SinglePage.js.map