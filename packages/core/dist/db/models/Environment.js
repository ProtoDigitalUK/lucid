"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Environment_checkAssignedBricks, _Environment_checkAssignedCollections, _Environment_checkAssignedForms, _Environment_checkKeyExists;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const slugify_1 = __importDefault(require("slugify"));
const Config_1 = __importDefault(require("../models/Config"));
const format_environment_1 = __importDefault(require("../../utils/environments/format-environment"));
const error_handler_1 = require("../../utils/app/error-handler");
const query_helpers_1 = require("../../utils/app/query-helpers");
class Environment {
}
_a = Environment;
Environment.getAll = async () => {
    const client = await db_1.default;
    const environments = await client.query({
        text: `SELECT *
        FROM 
          lucid_environments
        ORDER BY
          key ASC`,
        values: [],
    });
    return environments.rows.map((environment) => (0, format_environment_1.default)(environment));
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
    return (0, format_environment_1.default)(environment.rows[0]);
};
Environment.upsertSingle = async (data, create) => {
    const client = await db_1.default;
    const key = create ? (0, slugify_1.default)(data.key, { lower: true }) : data.key;
    if (!create) {
        await Environment.getSingle(key);
    }
    else {
        await __classPrivateFieldGet(Environment, _a, "f", _Environment_checkKeyExists).call(Environment, data.key);
    }
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "key",
            "title",
            "assigned_bricks",
            "assigned_collections",
            "assigned_forms",
        ],
        values: [
            key,
            data.title,
            data.assigned_bricks,
            data.assigned_collections,
            data.assigned_forms,
        ],
    });
    if (data.assigned_bricks) {
        await __classPrivateFieldGet(Environment, _a, "f", _Environment_checkAssignedBricks).call(Environment, data.assigned_bricks);
    }
    if (data.assigned_collections) {
        await __classPrivateFieldGet(Environment, _a, "f", _Environment_checkAssignedCollections).call(Environment, data.assigned_collections);
    }
    if (data.assigned_forms) {
        await __classPrivateFieldGet(Environment, _a, "f", _Environment_checkAssignedForms).call(Environment, data.assigned_forms);
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
            message: `Environment with key "${key}" could not be created`,
            status: 400,
        });
    }
    return (0, format_environment_1.default)(environments.rows[0]);
};
Environment.deleteSingle = async (key) => {
    const client = await db_1.default;
    await Environment.getSingle(key);
    const environments = await client.query({
        text: `DELETE FROM lucid_environments WHERE key = $1 RETURNING *`,
        values: [key],
    });
    if (environments.rows.length === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Environment not deleted",
            message: `Environment with key "${key}" could not be deleted`,
            status: 400,
        });
    }
    return (0, format_environment_1.default)(environments.rows[0]);
};
_Environment_checkAssignedBricks = { value: async (assigned_bricks) => {
        const brickInstances = Config_1.default.bricks || [];
        const brickKeys = brickInstances.map((b) => b.key);
        const invalidBricks = assigned_bricks.filter((b) => !brickKeys.includes(b));
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
    } };
_Environment_checkAssignedCollections = { value: async (assigned_collections) => {
        const collectionInstances = Config_1.default.collections || [];
        const collectionKeys = collectionInstances.map((c) => c.key);
        const invalidCollections = assigned_collections.filter((c) => !collectionKeys.includes(c));
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
    } };
_Environment_checkAssignedForms = { value: async (assigned_forms) => {
        const formInstances = Config_1.default.forms || [];
        const formKeys = formInstances.map((f) => f.key);
        const invalidForms = assigned_forms.filter((f) => !formKeys.includes(f));
        if (invalidForms.length > 0) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Invalid form keys",
                message: `Make sure all assigned_forms are valid.`,
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    assigned_forms: {
                        code: "invalid",
                        message: `Make sure all assigned_forms are valid.`,
                        children: invalidForms.map((f) => ({
                            code: "invalid",
                            message: `Form with key "${f}" not found.`,
                        })),
                    },
                }),
            });
        }
    } };
_Environment_checkKeyExists = { value: async (key) => {
        const client = await db_1.default;
        const environments = await client.query({
            text: `SELECT * FROM lucid_environments WHERE key = $1`,
            values: [key],
        });
        if (environments.rows.length > 0) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Environment already exists",
                message: `Environment with key "${key}" already exists`,
                status: 400,
            });
        }
    } };
exports.default = Environment;
//# sourceMappingURL=Environment.js.map