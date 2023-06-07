"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../utils/error-handler");
const BrickConfig_1 = __importDefault(require("../db/models/BrickConfig"));
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
const validateBricks = async (req, res, next) => {
    try {
        const builderInstances = BrickConfig_1.default.getBrickConfig();
        const bodyBricks = req.body.bricks || [];
        const errors = [];
        let hasErrors = false;
        for (let i = 0; i < bodyBricks.length; i++) {
            const brick = bodyBricks[i];
            const brickErrors = {
                key: brick.key,
                errors: [],
            };
            const instance = builderInstances.find((b) => b.key === brick.key);
            if (!instance) {
                throw new error_handler_1.LucidError({
                    type: "basic",
                    name: "Brick not found",
                    message: "We could not find the brick you are looking for.",
                    status: 404,
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
        if (hasErrors) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Validation Error",
                message: "There was an error validating your bricks.",
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    bricks: buildErrorObject(errors),
                }),
            });
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = validateBricks;
//# sourceMappingURL=validate-bricks.js.map