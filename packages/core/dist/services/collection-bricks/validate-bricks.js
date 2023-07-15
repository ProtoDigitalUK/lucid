"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const brick_config_1 = __importDefault(require("../brick-config"));
const pages_1 = __importDefault(require("../pages"));
const media_1 = __importDefault(require("../media"));
const flattenAllBricks = (builder_bricks, fixed_bricks) => {
    if (!builder_bricks && !fixed_bricks)
        return {
            builder_bricks: [],
            fixed_bricks: [],
            flat_fields: [],
        };
    const builderBricks = [];
    const fixedBricks = [];
    const flatBricks = [];
    for (let brick of builder_bricks) {
        const flatFields = flattenBricksFields(brick.fields);
        builderBricks.push({
            brick_key: brick.key,
            flat_fields: flatFields,
        });
        flatBricks.push(...flatFields);
    }
    for (let brick of fixed_bricks) {
        const flatFields = flattenBricksFields(brick.fields);
        fixedBricks.push({
            brick_key: brick.key,
            flat_fields: flatFields,
        });
        flatBricks.push(...flatFields);
    }
    return {
        builder_bricks: builderBricks,
        fixed_bricks: fixedBricks,
        flat_fields: flatBricks,
    };
};
const flattenBricksFields = (fields) => {
    let flatFields = [];
    if (!fields)
        return flatFields;
    for (let brick of fields) {
        let flatBrick = {
            fields_id: brick.fields_id,
            parent_repeater: brick.parent_repeater,
            key: brick.key,
            type: brick.type,
            value: brick.value,
            target: brick.target,
            group_position: brick.group_position,
        };
        Object.keys(flatBrick).forEach((key) => flatBrick[key] === undefined && delete flatBrick[key]);
        flatFields.push(flatBrick);
        if (brick.items) {
            flatFields = flatFields.concat(flattenBricksFields(brick.items));
        }
    }
    return flatFields;
};
const errorKey = (key, group_position) => {
    return group_position ? `${key}[${group_position}]` : key;
};
const buildErrorObject = (brickErrors) => {
    const errorObject = {};
    brickErrors.forEach((brick, index) => {
        const brickKeyWithIndex = `${brick.key}[${index}]`;
        errorObject[brickKeyWithIndex] = {};
        brick.errors.forEach((error) => {
            const brickObj = errorObject[brickKeyWithIndex];
            brickObj[error.key] = {
                code: "invalid",
                message: error.message || "Invalid value.",
            };
        });
    });
    return errorObject;
};
const validateBricksGroup = async (data) => {
    const errors = [];
    let hasErrors = false;
    for (let i = 0; i < data.bricks.length; i++) {
        const brick = data.bricks[i];
        const brickErrors = {
            key: brick.brick_key,
            errors: [],
        };
        const instance = data.builderInstances.find((b) => b.key === brick.brick_key);
        if (!instance) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Brick not found",
                message: "We could not find the brick you are looking for.",
                status: 404,
            });
        }
        const allowed = brick_config_1.default.isBrickAllowed({
            key: brick.brick_key,
            type: data.type,
            environment: data.environment,
            collection: data.collection,
        });
        if (!allowed.allowed) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Brick not allowed",
                message: `The brick "${brick.brick_key}" of type "${data.type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
                status: 500,
            });
        }
        const flatFields = brick.flat_fields;
        for (let j = 0; j < flatFields.length; j++) {
            const field = flatFields[j];
            let referenceData = undefined;
            switch (field.type) {
                case "link": {
                    referenceData = {
                        target: field.target,
                    };
                    break;
                }
                case "pagelink": {
                    const page = data.pages.find((p) => p.id === field.value);
                    if (page) {
                        referenceData = {
                            target: field.target,
                        };
                    }
                    break;
                }
                case "media": {
                    const media = data.media.find((m) => m.id === field.value);
                    if (media) {
                        referenceData = {
                            extension: media.meta.file_extension,
                            width: media.meta.width,
                            height: media.meta.height,
                        };
                    }
                    break;
                }
            }
            const err = instance.fieldValidation({
                key: field.key,
                value: field.value,
                type: field.type,
                referenceData,
                flatFieldConfig: instance.flatFields,
            });
            if (err.valid === false) {
                brickErrors.errors.push({
                    key: errorKey(field.key, field.group_position),
                    message: err.message,
                });
                hasErrors = true;
            }
        }
        errors.push(brickErrors);
    }
    return { errors, hasErrors };
};
const getAllMedia = async (client, fields) => {
    try {
        const getIDs = fields.map((field) => {
            if (field.type === "media") {
                return field.value;
            }
        });
        const ids = getIDs
            .filter((id) => id !== undefined)
            .filter((value, index, self) => self.indexOf(value) === index);
        const media = await (0, service_1.default)(media_1.default.getMultipleByIds, false, client)({
            ids: ids,
        });
        return media;
    }
    catch (err) {
        return [];
    }
};
const getAllPages = async (client, fields, environment_key) => {
    try {
        const getIDs = fields.map((field) => {
            if (field.type === "pagelink") {
                return field.value;
            }
        });
        const ids = getIDs
            .filter((id) => id !== undefined)
            .filter((value, index, self) => self.indexOf(value) === index);
        const pages = await (0, service_1.default)(pages_1.default.getMultipleById, false, client)({
            ids,
            environment_key,
        });
        return pages;
    }
    catch (err) {
        return [];
    }
};
const validateBricks = async (client, data) => {
    const builderInstances = brick_config_1.default.getBrickConfig();
    const bricksFlattened = flattenAllBricks(data.builder_bricks, data.fixed_bricks);
    const pageMediaPromises = await Promise.all([
        getAllMedia(client, bricksFlattened.flat_fields),
        getAllPages(client, bricksFlattened.flat_fields, data.environment.key),
    ]);
    const media = pageMediaPromises[0];
    const pages = pageMediaPromises[1];
    const { errors: builderErrors, hasErrors: builderHasErrors } = await validateBricksGroup({
        bricks: bricksFlattened.builder_bricks,
        builderInstances: builderInstances,
        collection: data.collection,
        environment: data.environment,
        type: "builder",
        media: media,
        pages: pages,
    });
    const { errors: fixedErrors, hasErrors: fixedHasErrors } = await validateBricksGroup({
        bricks: bricksFlattened.fixed_bricks,
        builderInstances: builderInstances,
        collection: data.collection,
        environment: data.environment,
        type: "fixed",
        media: media,
        pages: pages,
    });
    if (builderHasErrors || fixedHasErrors) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Validation Error",
            message: "There was an error validating your bricks.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
                builder_bricks: buildErrorObject(builderErrors),
                fixed_bricks: buildErrorObject(fixedErrors),
            }),
        });
    }
};
exports.default = validateBricks;
//# sourceMappingURL=validate-bricks.js.map