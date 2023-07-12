"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Option_1 = __importDefault(require("../../db/models/Option"));
const convert_to_type_1 = __importDefault(require("../../utils/options/convert-to-type"));
const convert_to_string_1 = __importDefault(require("../../utils/options/convert-to-string"));
const patchByName = async (data) => {
    const value = (0, convert_to_string_1.default)(data.value, data.type);
    const option = await Option_1.default.patchByName({
        name: data.name,
        value,
        type: data.type,
    });
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
    return (0, convert_to_type_1.default)(option);
};
exports.default = patchByName;
//# sourceMappingURL=patch-by-name.js.map