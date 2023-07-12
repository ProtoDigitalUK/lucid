"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const error_handler_1 = require("../../utils/app/error-handler");
const environments_1 = __importDefault(require("../environments"));
const Config_1 = __importDefault(require("../Config"));
const checkAssignedBricks = async (assigned_bricks) => {
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
};
const checkAssignedCollections = async (assigned_collections) => {
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
};
const checkAssignedForms = async (assigned_forms) => {
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
};
const upsertSingle = async (data) => {
    const key = data.create
        ? (0, slugify_1.default)(data.data.key, { lower: true })
        : data.data.key;
    if (!data.create) {
        await environments_1.default.getSingle({
            key: data.data.key,
        });
    }
    else {
        await environments_1.default.checkKeyExists({
            key: data.data.key,
        });
    }
    if (data.data.assigned_bricks) {
        await checkAssignedBricks(data.data.assigned_bricks);
    }
    if (data.data.assigned_collections) {
        await checkAssignedCollections(data.data.assigned_collections);
    }
    if (data.data.assigned_forms) {
        await checkAssignedForms(data.data.assigned_forms);
    }
    const environment = await Environment_1.default.upsertSingle({
        key,
        title: data.data.title,
        assigned_bricks: data.data.assigned_bricks,
        assigned_collections: data.data.assigned_collections,
        assigned_forms: data.data.assigned_forms,
    });
    if (!environment) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Environment not created",
            message: `Environment with key "${key}" could not be created`,
            status: 400,
        });
    }
    return environments_1.default.format(environment);
};
exports.default = upsertSingle;
//# sourceMappingURL=upsert-single.js.map