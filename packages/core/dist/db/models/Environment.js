"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const Config_1 = __importDefault(require("../models/Config"));
const error_handler_1 = require("../../utils/error-handler");
const query_helpers_1 = require("../../utils/query-helpers");
class Environment {
}
_a = Environment;
Environment.getAll = async () => {
    const client = await db_1.default;
    const environmentConfig = Config_1.default.environments;
    const envKeys = environmentConfig.map((e) => e.key);
    const environments = await client.query({
        text: `SELECT *
        FROM 
          lucid_environments
        WHERE 
          key = ANY($1)`,
        values: [envKeys],
    });
    return environments.rows;
};
Environment.getSingle = async (key) => {
    const client = await db_1.default;
    const environment = await client.query({
        text: `SELECT * FROM lucid_environments WHERE key = $1`,
        values: [key],
    });
    if (environment.rows.length === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Environment not found",
            message: `Environment with key "${key}" not found`,
            status: 404,
        });
    }
    return environment.rows[0];
};
Environment.upsertSingle = async (data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["key", "title", "assigned_bricks", "assigned_collections"],
        values: [
            data.key,
            data.title,
            data.assigned_bricks,
            data.assigned_collections,
        ],
    });
    if (data.assigned_bricks) {
        const brickInstances = Config_1.default.bricks || [];
        const brickKeys = brickInstances.map((b) => b.key);
        const invalidBricks = data.assigned_bricks.filter((b) => !brickKeys.includes(b));
        if (invalidBricks.length > 0) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Invalid brick keys",
                message: `Make sure all assigned_bricks are valid.`,
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    assigned_bricks: {
                        code: "invalid",
                        message: `Make sure all assigned_bricks are valid.`,
                        children: invalidBricks.map((b) => ({
                            code: "invalid",
                            message: `Brick with key "${b}" not found.`,
                        })),
                    },
                }),
            });
        }
    }
    if (data.assigned_collections) {
        const collectionInstances = Config_1.default.collections || [];
        const collectionKeys = collectionInstances.map((c) => c.key);
        const invalidCollections = data.assigned_collections.filter((c) => !collectionKeys.includes(c));
        if (invalidCollections.length > 0) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Invalid collection keys",
                message: `Make sure all assigned_collections are valid.`,
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    assigned_collections: {
                        code: "invalid",
                        message: `Make sure all assigned_collections are valid.`,
                        children: invalidCollections.map((c) => ({
                            code: "invalid",
                            message: `Collection with key "${c}" not found.`,
                        })),
                    },
                }),
            });
        }
    }
    const environments = await client.query({
        text: `INSERT INTO lucid_environments (${columns.formatted.insert}) 
        VALUES (${aliases.formatted.insert}) 
        ON CONFLICT (key) 
        DO UPDATE SET ${columns.formatted.doUpdate}
        RETURNING *`,
        values: [...values.value],
    });
    if (environments.rows.length === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Environment not created",
            message: `Environment with key "${data.key}" could not be created`,
            status: 400,
        });
    }
    return environments.rows[0];
};
exports.default = Environment;
//# sourceMappingURL=Environment.js.map