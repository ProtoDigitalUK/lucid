"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormBuilder = exports.CollectionBuilder = exports.BrickBuilder = exports.sendEmail = exports.buildConfig = exports.init = void 0;
require("dotenv").config();
const init_1 = __importDefault(require("./init"));
exports.init = init_1.default;
const send_email_1 = require("./services/emails/send-email");
const Config_1 = require("./db/models/Config");
Object.defineProperty(exports, "buildConfig", { enumerable: true, get: function () { return Config_1.buildConfig; } });
const brick_builder_1 = __importDefault(require("@lucid/brick-builder"));
exports.BrickBuilder = brick_builder_1.default;
const collection_builder_1 = __importDefault(require("@lucid/collection-builder"));
exports.CollectionBuilder = collection_builder_1.default;
const form_builder_1 = __importDefault(require("@lucid/form-builder"));
exports.FormBuilder = form_builder_1.default;
const sendEmail = send_email_1.sendEmailExternal;
exports.sendEmail = sendEmail;
exports.default = {
    init: init_1.default,
    buildConfig: Config_1.buildConfig,
    sendEmail,
    BrickBuilder: brick_builder_1.default,
    CollectionBuilder: collection_builder_1.default,
    FormBuilder: form_builder_1.default,
};
//# sourceMappingURL=index.js.map