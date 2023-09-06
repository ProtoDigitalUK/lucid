"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Email_js_1 = __importDefault(require("../../db/models/Email.js"));
const deleteSingle = async (client, data) => {
    const email = await Email_js_1.default.deleteSingle(client, {
        id: data.id,
    });
    if (email) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Email",
            message: "Email not found",
            status: 404,
        });
    }
    return email;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map