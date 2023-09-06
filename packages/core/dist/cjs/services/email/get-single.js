"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Email_js_1 = __importDefault(require("../../db/models/Email.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const index_js_1 = __importDefault(require("../email/index.js"));
const getSingle = async (client, data) => {
    const email = await Email_js_1.default.getSingle(client, {
        id: data.id,
    });
    if (!email) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Email",
            message: "Email not found",
            status: 404,
        });
    }
    const html = await index_js_1.default.renderTemplate(email.template, email.data || {});
    email.html = html;
    return email;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map