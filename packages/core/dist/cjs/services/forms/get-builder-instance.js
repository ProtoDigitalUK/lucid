"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_js_1 = __importDefault(require("../Config.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const getBuilderInstance = (data) => {
    const FormBuilderInstances = Config_js_1.default.forms || [];
    const form = FormBuilderInstances.find((form) => form.key === data.form_key);
    if (!form) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Form Error",
            message: "Form not found.",
            status: 404,
        });
    }
    return form;
};
exports.default = getBuilderInstance;
//# sourceMappingURL=get-builder-instance.js.map