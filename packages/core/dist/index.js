"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.buildConfig = exports.init = void 0;
require("dotenv").config();
const init_1 = __importDefault(require("./init"));
exports.init = init_1.default;
const Config_1 = require("./db/models/Config");
Object.defineProperty(exports, "buildConfig", { enumerable: true, get: function () { return Config_1.buildConfig; } });
const send_email_1 = require("./services/emails/send-email");
const sendEmail = send_email_1.sendEmailInternal;
exports.sendEmail = sendEmail;
exports.default = {
    init: init_1.default,
    buildConfig: Config_1.buildConfig,
    sendEmail,
};
//# sourceMappingURL=index.js.map