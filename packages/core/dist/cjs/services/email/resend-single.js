"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../email/index.js"));
const resendSingle = async (client, data) => {
    const email = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        id: data.id,
    });
    const status = await index_js_1.default.sendEmailInternal(client, {
        template: email.template,
        params: {
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
        },
        id: data.id,
    });
    const updatedEmail = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        id: data.id,
    });
    return {
        status,
        email: updatedEmail,
    };
};
exports.default = resendSingle;
//# sourceMappingURL=resend-single.js.map