"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_single_1 = __importDefault(require("./delete-single"));
const get_multiple_1 = __importDefault(require("./get-multiple"));
const get_single_1 = __importDefault(require("./get-single"));
const resend_single_1 = __importDefault(require("./resend-single"));
const create_single_1 = __importDefault(require("./create-single"));
const update_single_1 = __importDefault(require("./update-single"));
const render_template_1 = __importDefault(require("./render-template"));
const send_email_1 = require("./send-email");
exports.default = {
    deleteSingle: delete_single_1.default,
    getMultiple: get_multiple_1.default,
    getSingle: get_single_1.default,
    resendSingle: resend_single_1.default,
    createSingle: create_single_1.default,
    updateSingle: update_single_1.default,
    renderTemplate: render_template_1.default,
    sendEmailExternal: send_email_1.sendEmailExternal,
    sendEmailInternal: send_email_1.sendEmailInternal,
};
//# sourceMappingURL=index.js.map