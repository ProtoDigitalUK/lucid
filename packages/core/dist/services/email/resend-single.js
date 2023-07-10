"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = __importDefault(require("../email"));
const resendSingle = async (data) => {
    const email = await email_1.default.getSingle({
        id: data.id,
    });
    const status = await email_1.default.sendEmailInternal(email.template, {
        data: email.data || {},
        options: {
            to: email.to_address || "",
            subject: email.subject || "",
            from: email.from_address || undefined,
            fromName: email.from_name || undefined,
            cc: email.cc || undefined,
            bcc: email.bcc || undefined,
            replyTo: email.from_address || undefined,
        },
    }, data.id);
    const updatedEmail = await email_1.default.getSingle({
        id: data.id,
    });
    return {
        status,
        email: updatedEmail,
    };
};
exports.default = resendSingle;
//# sourceMappingURL=resend-single.js.map