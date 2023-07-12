"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FormSubmission_1 = __importDefault(require("../../db/models/FormSubmission"));
const query_helpers_1 = require("../../utils/app/query-helpers");
const form_submissions_1 = __importDefault(require("../form-submissions"));
const forms_1 = __importDefault(require("../forms"));
const format_form_submission_1 = __importDefault(require("../../utils/format/format-form-submission"));
const getMultiple = async (data) => {
    await form_submissions_1.default.hasEnvironmentPermission(data);
    const { sort, include, page, per_page } = data.query;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "form_key",
            "environment_key",
            "read_at",
            "created_at",
            "updated_at",
        ],
        filter: {
            data: {
                environment_key: data.environment_key,
                form_key: data.form_key,
            },
            meta: {
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                form_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const formSubmissionsRes = await FormSubmission_1.default.getMultiple(SelectQuery);
    const formBuilder = forms_1.default.getBuilderInstance({
        form_key: data.form_key,
    });
    let formData = [];
    if (include?.includes("fields")) {
        const formSubmissionIds = formSubmissionsRes.data.map((submission) => submission.id);
        formData = await FormSubmission_1.default.getAllFormData(formSubmissionIds);
    }
    const formattedSubmissions = formSubmissionsRes.data.map((submission) => {
        return (0, format_form_submission_1.default)(formBuilder, {
            submission,
            data: formData.filter((field) => field.form_submission_id === submission.id),
        });
    });
    return {
        data: formattedSubmissions,
        count: formSubmissionsRes.count,
    };
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map