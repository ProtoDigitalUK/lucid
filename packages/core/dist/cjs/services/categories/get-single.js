"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_js_1 = __importDefault(require("../../db/models/Category.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const getSingle = async (client, data) => {
    const category = await Category_js_1.default.getSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
    });
    if (!category) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Category Not Found",
            message: "Category not found.",
            status: 404,
            errors: (0, error_handler_js_1.modelErrors)({
                id: {
                    code: "not_found",
                    message: "Category not found.",
                },
            }),
        });
    }
    return category;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map