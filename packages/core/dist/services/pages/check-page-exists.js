"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Page_1 = __importDefault(require("../../db/models/Page"));
const checkPageExists = async (client, data) => {
    const page = await Page_1.default.getSingleBasic(client, {
        id: data.id,
        environment_key: data.environment_key,
    });
    if (!page) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page not found",
            message: `Page with id "${data.id}" not found in environment "${data.environment_key}"!`,
            status: 404,
        });
    }
    return page;
};
exports.default = checkPageExists;
//# sourceMappingURL=check-page-exists.js.map