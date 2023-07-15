"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const error_handler_1 = require("../../utils/app/error-handler");
const deleteSingle = async (client, data) => {
    const category = await Category_1.default.deleteSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
    });
    if (!category) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Deleted",
            message: "There was an error deleting the category.",
            status: 500,
        });
    }
    return category;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map