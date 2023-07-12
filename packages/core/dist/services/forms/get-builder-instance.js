"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../Config"));
const error_handler_1 = require("../../utils/app/error-handler");
const getBuilderInstance = (data) => {
    const FormBuilderInstances = Config_1.default.forms || [];
    const form = FormBuilderInstances.find((form) => form.key === data.form_key);
    if (!form) {
        throw new error_handler_1.LucidError({
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