"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitForm = exports.FormBuilder = exports.CollectionBuilder = exports.BrickBuilder = exports.sendEmail = exports.buildConfig = exports.init = void 0;
require("dotenv").config();
const init_1 = __importDefault(require("./init"));
exports.init = init_1.default;
const Config_1 = require("./services/Config");
Object.defineProperty(exports, "buildConfig", { enumerable: true, get: function () { return Config_1.buildConfig; } });
const form_submissions_1 = __importDefault(require("./services/form-submissions"));
const email_1 = __importDefault(require("./services/email"));
const brick_builder_1 = __importDefault(require("@lucid/brick-builder"));
exports.BrickBuilder = brick_builder_1.default;
const collection_builder_1 = __importDefault(require("@lucid/collection-builder"));
exports.CollectionBuilder = collection_builder_1.default;
const form_builder_1 = __importDefault(require("@lucid/form-builder"));
exports.FormBuilder = form_builder_1.default;
const sendEmail = email_1.default.sendEmailExternal;
exports.sendEmail = sendEmail;
const submitForm = form_submissions_1.default.submitForm;
exports.submitForm = submitForm;
exports.default = {
    init: init_1.default,
};
//# sourceMappingURL=index.js.map