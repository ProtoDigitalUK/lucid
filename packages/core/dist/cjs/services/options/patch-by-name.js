"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Option_js_1 = __importDefault(require("../../db/models/Option.js"));
const convert_to_type_js_1 = __importDefault(require("../../utils/options/convert-to-type.js"));
const convert_to_string_js_1 = __importDefault(require("../../utils/options/convert-to-string.js"));
const format_option_js_1 = __importDefault(require("../../utils/format/format-option.js"));
const patchByName = async (client, data) => {
    const value = (0, convert_to_string_js_1.default)(data.value, data.type);
    const option = await Option_js_1.default.patchByName(client, {
        name: data.name,
        value,
        type: data.type,
    });
    if (!option) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Option Not Found",
            message: "There was an error patching the option.",
            status: 500,
            errors: (0, error_handler_js_1.modelErrors)({
                option_name: {
                    code: "not_found",
                    message: "Option not found.",
                },
            }),
        });
    }
    const convertOptionType = (0, convert_to_type_js_1.default)(option);
    return (0, format_option_js_1.default)([convertOptionType]);
};
exports.default = patchByName;
//# sourceMappingURL=patch-by-name.js.map