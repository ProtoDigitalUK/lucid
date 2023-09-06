"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_single_js_1 = __importDefault(require("./delete-single.js"));
const get_multiple_js_1 = __importDefault(require("./get-multiple.js"));
const get_single_js_1 = __importDefault(require("./get-single.js"));
const resend_single_js_1 = __importDefault(require("./resend-single.js"));
const create_single_js_1 = __importDefault(require("./create-single.js"));
const update_single_js_1 = __importDefault(require("./update-single.js"));
const render_template_js_1 = __importDefault(require("./render-template.js"));
const send_email_js_1 = require("./send-email.js");
exports.default = {
    deleteSingle: delete_single_js_1.default,
    getMultiple: get_multiple_js_1.default,
    getSingle: get_single_js_1.default,
    resendSingle: resend_single_js_1.default,
    createSingle: create_single_js_1.default,
    updateSingle: update_single_js_1.default,
    renderTemplate: render_template_js_1.default,
    sendEmailExternal: send_email_js_1.sendEmailExternal,
    sendEmailInternal: send_email_js_1.sendEmailInternal,
};
//# sourceMappingURL=index.js.map