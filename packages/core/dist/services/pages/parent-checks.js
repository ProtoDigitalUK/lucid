"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const pages_1 = __importDefault(require("../pages"));
const parentChecks = async (data) => {
    const parent = await pages_1.default.checkPageExists({
        id: data.parent_id,
        environment_key: data.environment_key,
    });
    if (parent.homepage) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Homepage Parent",
            message: "The homepage cannot be set as a parent!",
            status: 400,
        });
    }
    if (parent.collection_key !== data.collection_key) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Parent Collection Mismatch",
            message: "The parent page must be in the same collection as the page you are creating!",
            status: 400,
        });
    }
    return parent;
};
exports.default = parentChecks;
//# sourceMappingURL=parent-checks.js.map