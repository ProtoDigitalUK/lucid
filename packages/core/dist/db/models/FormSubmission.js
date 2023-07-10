"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _FormSubmission_checkFormEnvrionmentPermissions, _FormSubmission_getFormBuilder, _FormSubmission_createNewFormSubmission, _FormSubmission_createNewFormData, _FormSubmission_getAllFormData;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/app/error-handler");
const query_helpers_1 = require("../../utils/app/query-helpers");
const form_submissions_1 = __importDefault(require("../../services/form-submissions"));
const Config_1 = __importDefault(require("../models/Config"));
const environments_1 = __importDefault(require("../../services/environments"));
class FormSubmission {
}
_a = FormSubmission;
FormSubmission.createSingle = async (data) => {
    await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_checkFormEnvrionmentPermissions).call(FormSubmission, data);
    const formBuilder = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_getFormBuilder).call(FormSubmission, data.form_key);
    const formSubmission = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_createNewFormSubmission).call(FormSubmission, {
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    const formData = await Promise.all(data.data.map((field) => __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_createNewFormData).call(FormSubmission, {
        form_submission_id: formSubmission.id,
        name: field.name,
        type: field.type,
        value: field.value,
    })));
    const formDataRes = formData.map((field) => field.rows[0]);
    return form_submissions_1.default.format(formBuilder, {
        submission: formSubmission,
        data: formDataRes,
    });
};
FormSubmission.getSingle = async (data) => {
    const client = await db_1.default;
    await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_checkFormEnvrionmentPermissions).call(FormSubmission, data);
    const formSubmission = await client.query({
        text: `SELECT * FROM lucid_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3;`,
        values: [data.id, data.form_key, data.environment_key],
    });
    if (!formSubmission.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form submission does not exist.",
            status: 404,
        });
    }
    let formData = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_getAllFormData).call(FormSubmission, [
        formSubmission.rows[0].id,
    ]);
    formData = formData.filter((field) => field.form_submission_id === formSubmission.rows[0].id);
    const formBuilder = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_getFormBuilder).call(FormSubmission, formSubmission.rows[0].form_key);
    return form_submissions_1.default.format(formBuilder, {
        submission: formSubmission.rows[0],
        data: formData,
    });
};
FormSubmission.getMultiple = async (query, data) => {
    const client = await db_1.default;
    await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_checkFormEnvrionmentPermissions).call(FormSubmission, data);
    const { sort, include, page, per_page } = query;
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
    const submissions = await client.query({
        text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_form_submissions
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
        values: SelectQuery.values,
    });
    const count = await client.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_form_submissions.id)
        FROM
          lucid_form_submissions
        ${SelectQuery.query.where} `,
        values: SelectQuery.countValues,
    });
    const formBuilder = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_getFormBuilder).call(FormSubmission, data.form_key);
    let formData = [];
    if (include?.includes("fields")) {
        const formSubmissionIds = submissions.rows.map((submission) => submission.id);
        formData = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_getAllFormData).call(FormSubmission, formSubmissionIds);
    }
    const formattedSubmissions = submissions.rows.map((submission) => {
        return form_submissions_1.default.format(formBuilder, {
            submission,
            data: formData.filter((field) => field.form_submission_id === submission.id),
        });
    });
    return {
        data: formattedSubmissions,
        count: count.rows[0].count,
    };
};
FormSubmission.toggleReadAt = async (data) => {
    const client = await db_1.default;
    await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_checkFormEnvrionmentPermissions).call(FormSubmission, {
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    const formSubmission = await client.query({
        text: `SELECT read_at FROM lucid_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3;`,
        values: [data.id, data.form_key, data.environment_key],
    });
    if (!formSubmission.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form submission does not exist.",
            status: 404,
        });
    }
    const newReadAt = formSubmission.rows[0].read_at ? null : new Date();
    const updatedFormSubmission = await client.query({
        text: `UPDATE lucid_form_submissions SET read_at = $1 WHERE id = $2 AND form_key = $3 AND environment_key = $4 RETURNING *;`,
        values: [newReadAt, data.id, data.form_key, data.environment_key],
    });
    if (!updatedFormSubmission.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form submission does not exist.",
            status: 404,
        });
    }
    let formData = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_getAllFormData).call(FormSubmission, [
        updatedFormSubmission.rows[0].id,
    ]);
    formData = formData.filter((field) => field.form_submission_id === updatedFormSubmission.rows[0].id);
    const formBuilder = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_getFormBuilder).call(FormSubmission, updatedFormSubmission.rows[0].form_key);
    return form_submissions_1.default.format(formBuilder, {
        submission: updatedFormSubmission.rows[0],
        data: formData,
    });
};
FormSubmission.deleteSingle = async (data) => {
    const client = await db_1.default;
    await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_checkFormEnvrionmentPermissions).call(FormSubmission, {
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    const formSubmission = await client.query({
        text: `DELETE FROM lucid_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3 RETURNING *;`,
        values: [data.id, data.form_key, data.environment_key],
    });
    if (!formSubmission.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form submission does not exist.",
            status: 404,
        });
    }
    const formBuilder = await __classPrivateFieldGet(FormSubmission, _a, "f", _FormSubmission_getFormBuilder).call(FormSubmission, data.form_key);
    return form_submissions_1.default.format(formBuilder, {
        submission: formSubmission.rows[0],
        data: [],
    });
};
_FormSubmission_checkFormEnvrionmentPermissions = { value: async (data) => {
        const environment = await environments_1.default.getSingle({
            key: data.environment_key,
        });
        const hasPerm = environment.assigned_forms?.includes(data.form_key);
        if (!hasPerm) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Form Error",
                message: "This form is not assigned to this environment.",
                status: 403,
            });
        }
        return environment;
    } };
_FormSubmission_getFormBuilder = { value: async (form_key) => {
        const FormBuilderInstances = Config_1.default.forms || [];
        const form = FormBuilderInstances.find((form) => form.key === form_key);
        if (!form) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Form Error",
                message: "Form not found.",
                status: 404,
            });
        }
        return form;
    } };
_FormSubmission_createNewFormSubmission = { value: async (data) => {
        const client = await db_1.default;
        const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
            columns: ["form_key", "environment_key"],
            values: [data.form_key, data.environment_key],
        });
        const res = await client.query({
            text: `INSERT INTO lucid_form_submissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
        if (res.rows.length === 0) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Form Submission Error",
                message: "Failed to create form submission entry.",
                status: 500,
            });
        }
        return res.rows[0];
    } };
_FormSubmission_createNewFormData = { value: async (data) => {
        const client = await db_1.default;
        const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
            columns: [
                "form_submission_id",
                "name",
                "text_value",
                "number_value",
                "boolean_value",
            ],
            values: [
                data.form_submission_id,
                data.name,
                data.type === "string" ? data.value : null,
                data.type === "number" ? data.value : null,
                data.type === "boolean" ? data.value : null,
            ],
        });
        return client.query({
            text: `INSERT INTO lucid_form_data (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
    } };
_FormSubmission_getAllFormData = { value: async (submission_ids) => {
        const client = await db_1.default;
        const res = await client.query({
            text: `SELECT * FROM lucid_form_data WHERE form_submission_id = ANY($1)`,
            values: [submission_ids],
        });
        if (res.rows.length === 0) {
            return [];
        }
        return res.rows;
    } };
exports.default = FormSubmission;
//# sourceMappingURL=FormSubmission.js.map