"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const FormSubmission_1 = __importDefault(require("../../db/models/FormSubmission"));
const form_submissions_1 = __importDefault(require("../form-submissions"));
const forms_1 = __importDefault(require("../forms"));
const format_form_submission_1 = __importDefault(require("../../utils/format/format-form-submission"));
const createSingle = async (data) => {
    await form_submissions_1.default.hasEnvironmentPermission(data);
    const formBuilder = forms_1.default.getBuilderInstance({
        form_key: data.form_key,
    });
    const formSubmission = await FormSubmission_1.default.createSingle({
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    if (!formSubmission) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form Submission Error",
            message: "Failed to create form submission entry.",
            status: 500,
        });
    }
    const formData = await Promise.all(data.data.map((field) => FormSubmission_1.default.createFormData({
        form_submission_id: formSubmission.id,
        name: field.name,
        type: field.type,
        value: field.value,
    })));
    return (0, format_form_submission_1.default)(formBuilder, {
        submission: formSubmission,
        data: formData,
    });
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map