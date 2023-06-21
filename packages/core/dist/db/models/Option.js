"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
class Option {
}
_a = Option;
Option.getByName = async (name) => {
    const options = await db_1.default.query({
        text: `SELECT * FROM lucid_options WHERE option_name = $1`,
        values: [name],
    });
    if (!options.rows[0]) {
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
    return Option.convertToType(options.rows[0]);
};
Option.patchByName = async (data) => {
    const value = Option.convertToString(data.value, data.type);
    const options = await db_1.default.query({
        text: `UPDATE lucid_options SET option_value = $1, type = $2, updated_at = NOW(), locked = $3 WHERE option_name = $4 AND locked = false RETURNING *`,
        values: [value, data.type, data.locked || false, data.name],
    });
    if (!options.rows[0]) {
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
    return Option.convertToType(options.rows[0]);
};
Option.create = async (data) => {
    const value = Option.convertToString(data.value, data.type);
    const optionExisting = await db_1.default.query({
        text: `SELECT * FROM lucid_options WHERE option_name = $1`,
        values: [data.name],
    });
    if (optionExisting.rows[0]) {
        return Option.convertToType(optionExisting.rows[0]);
    }
    const option = await db_1.default.query({
        text: `INSERT INTO lucid_options (option_name, option_value, type, locked) VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [data.name, value, data.type, data.locked || false],
    });
    if (!option.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Option Not Created",
            message: "There was an error creating the option.",
            status: 500,
        });
    }
    return Option.convertToType(option.rows[0]);
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