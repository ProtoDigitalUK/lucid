"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const FormSubmission_1 = __importDefault(require("../../db/models/FormSubmission"));
const form_submissions_1 = __importDefault(require("../form-submissions"));
const forms_1 = __importDefault(require("../forms"));
const format_form_submission_1 = __importDefault(require("../../utils/format/format-form-submission"));
const toggleReadAt = async (client, data) => {
    await (0, service_1.default)(form_submissions_1.default.hasEnvironmentPermission, false, client)({
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    const formSubmission = await (0, service_1.default)(form_submissions_1.default.getSingle, false, client)({
        id: data.id,
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    const updateFormSubmission = await FormSubmission_1.default.toggleReadAt(client, {
        id: data.id,
        form_key: data.form_key,
        environment_key: data.environment_key,
        read_at: formSubmission.read_at ? null : new Date(),
    });
    if (!updateFormSubmission) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form submission does not exist.",
            status: 404,
        });
    }
    let formData = await FormSubmission_1.default.getAllFormData(client, {
        submission_ids: [updateFormSubmission.id],
    });
    formData = formData.filter((field) => field.form_submission_id === updateFormSubmission.id);
    const formBuilder = forms_1.default.getBuilderInstance({
        form_key: updateFormSubmission.form_key,
    });
    return (0, format_form_submission_1.default)(formBuilder, {
        submission: updateFormSubmission,
        data: formData,
    });
};
exports.default = toggleReadAt;
//# sourceMappingURL=toggle-read-at.js.map