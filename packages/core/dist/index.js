"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const init_1 = __importDefault(require("./init"));
const send_email_1 = require("./services/emails/send-email");
exports.default = {
    init: init_1.default,
    sendEmail: send_email_1.sendEmailExternal,
};
//# sourceMappingURL=index.js.map