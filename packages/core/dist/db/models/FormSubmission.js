"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
class FormSubmission {
}
_a = FormSubmission;
FormSubmission.createSingle = async (client, data) => {
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["form_key", "environment_key"],
        values: [data.form_key, data.environment_key],
    });
    const res = await client.query({
        text: `INSERT INTO lucid_form_submissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return res.rows[0];
};
FormSubmission.getSingle = async (client, data) => {
    const formSubmission = await client.query({
        text: `SELECT * FROM lucid_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3;`,
        values: [data.id, data.form_key, data.environment_key],
    });
    return formSubmission.rows[0];
};
FormSubmission.getMultiple = async (client, query_instance) => {
    const submissions = client.query({
        text: `SELECT ${query_instance.query.select} FROM lucid_form_submissions ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
        values: query_instance.values,
    });
    const count = client.query({
        text: `SELECT COUNT(DISTINCT lucid_form_submissions.id) FROM lucid_form_submissions ${query_instance.query.where} `,
        values: query_instance.countValues,
    });
    const data = await Promise.all([submissions, count]);
    return {
        data: data[0].rows,
        count: Number(data[1].rows[0].count),
    };
};
FormSubmission.toggleReadAt = async (client, data) => {
    const updatedFormSubmission = await client.query({
        text: `UPDATE lucid_form_submissions SET read_at = $1 WHERE id = $2 AND form_key = $3 AND environment_key = $4 RETURNING *;`,
        values: [data.read_at, data.id, data.form_key, data.environment_key],
    });
    return updatedFormSubmission.rows[0];
};
FormSubmission.deleteSingle = async (client, data) => {
    const formSubmission = await client.query({
        text: `DELETE FROM lucid_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3 RETURNING *;`,
        values: [data.id, data.form_key, data.environment_key],
    });
    return formSubmission.rows[0];
};
FormSubmission.createFormData = async (client, data) => {
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
    const formData = await client.query({
        text: `INSERT INTO lucid_form_data (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return formData.rows[0];
};
FormSubmission.getAllFormData = async (client, data) => {
    const res = await client.query({
        text: `SELECT * FROM lucid_form_data WHERE form_submission_id = ANY($1)`,
        values: [data.submission_ids],
    });
    return res.rows;
};
exports.default = FormSubmission;
//# sourceMappingURL=FormSubmission.js.map