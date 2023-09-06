"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Option_js_1 = __importDefault(require("../../db/models/Option.js"));
const format_option_js_1 = __importDefault(require("../../utils/format/format-option.js"));
const convert_to_type_js_1 = __importDefault(require("../../utils/options/convert-to-type.js"));
const getByName = async (client, data) => {
    const option = await Option_js_1.default.getByName(client, {
        name: data.name,
    });
    if (!option) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Option Not Found",
            message: "There was an error finding the option.",
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
exports.default = getByName;
//# sourceMappingURL=get-by-name.js.map