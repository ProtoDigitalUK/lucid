"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("@db/db"));
const error_handler_1 = require("@utils/error-handler");
class Option {
}
_a = Option;
Option.getByName = async (name) => {
    const [option] = await (0, db_1.default) `
        SELECT * FROM lucid_options WHERE option_name = ${name}
        `;
    if (!option) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Option Not Found",
            message: "There was an error finding the option.",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                option_name: {
                    code: "not_found",
                    message: "Option not found.",
                },
            }),
        });
    }
    return Option.convertToType(option);
};
Option.patchByName = async (data) => {
    const value = Option.convertToString(data.value, data.type);
    const [option] = await (0, db_1.default) `
        UPDATE lucid_options 
        SET option_value = ${value},
            type = ${data.type},
            updated_at = NOW(),
            locked = ${data.locked || false}
        WHERE option_name = ${data.name} 
        AND locked = false
        RETURNING *`;
    if (!option) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Option Not Found",
            message: "There was an error patching the option.",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                option_name: {
                    code: "not_found",
                    message: "Option not found.",
                },
            }),
        });
    }
    return Option.convertToType(option);
};
Option.create = async (data) => {
    const value = Option.convertToString(data.value, data.type);
    const [optionExisting] = await (0, db_1.default) `SELECT * FROM lucid_options WHERE option_name = ${data.name}`;
    if (optionExisting)
        return Option.convertToType(optionExisting);
    const [option] = await (0, db_1.default) `
        INSERT INTO lucid_options
        (option_name, option_value, type, locked)
        VALUES
        (${data.name}, ${value}, ${data.type}, ${data.locked || false})
        RETURNING *
        `;
    if (!option) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Option Not Created",
            message: "There was an error creating the option.",
            status: 500,
        });
    }
    return Option.convertToType(option);
};
Option.createOrPatch = async (data) => {
    try {
        const option = await Option.patchByName(data);
        return option;
    }
    catch (err) {
        const option = await Option.create(data);
        return option;
    }
};
Option.convertToType = (option) => {
    switch (option.type) {
        case "boolean":
            option.option_value = option.option_value === "true" ? true : false;
            break;
        case "number":
            option.option_value = parseInt(option.option_value);
            break;
        case "json":
            option.option_value = JSON.parse(option.option_value);
            break;
        default:
            option.option_value;
            break;
    }
    return option;
};
Option.convertToString = (value, type) => {
    switch (type) {
        case "boolean":
            value = value ? "true" : "false";
            break;
        case "json":
            value = JSON.stringify(value);
            break;
        default:
            value = value.toString();
            break;
    }
    return value;
};
exports.default = Option;
//# sourceMappingURL=Option.js.map