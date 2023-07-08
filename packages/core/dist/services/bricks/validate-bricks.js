"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/error-handler");
const BrickConfig_1 = __importDefault(require("../../db/models/BrickConfig"));
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
            key: brick.key,
            errors: [],
        };
        const instance = data.builderInstances.find((b) => b.key === brick.key);
        if (!instance) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Brick not found",
                message: "We could not find the brick you are looking for.",
                status: 404,
            });
        }
        const allowed = BrickConfig_1.default.isBrickAllowed({
            key: brick.key,
            type: data.type,
            environment: data.environment,
            collection: data.collection,
        });
        if (!allowed.allowed) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Brick not allowed",
                message: `The brick "${brick.key}" of type "${data.type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
                status: 500,
            });
        }
        const flatFields = flattenBricksFields(brick.fields);
        for (let j = 0; j < flatFields.length; j++) {
            const field = flatFields[j];
            let secondaryValue = undefined;
            switch (field.type) {
                case "link": {
                    secondaryValue = field.target;
                    break;
                }
                case "pagelink": {
                    secondaryValue = field.target;
                    break;
                }
            }
            const err = instance.fieldValidation({
                key: field.key,
                value: field.value,
                type: field.type,
                secondaryValue,
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
const validateBricks = async (data) => {
    const builderInstances = BrickConfig_1.default.getBrickConfig();
    const { errors: builderErrors, hasErrors: builderHasErrors } = await validateBricksGroup({
        bricks: data.builder_bricks,
        builderInstances: builderInstances,
        collection: data.collection,
        environment: data.environment,
        type: "builder",
    });
    const { errors: fixedErrors, hasErrors: fixedHasErrors } = await validateBricksGroup({
        bricks: data.fixed_bricks,
        builderInstances: builderInstances,
        collection: data.collection,
        environment: data.environment,
        type: "fixed",
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