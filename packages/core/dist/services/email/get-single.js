"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = __importDefault(require("../../db/models/Email"));
const error_handler_1 = require("../../utils/app/error-handler");
const email_1 = __importDefault(require("../email"));
const getSingle = async (data) => {
    const email = await Email_1.default.getSingle(data.id);
    if (!email) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Email",
            message: "Email not found",
            status: 404,
        });
    }
    const html = await email_1.default.renderTemplate(email.template, email.data || {});
    email.html = html;
    return email;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map