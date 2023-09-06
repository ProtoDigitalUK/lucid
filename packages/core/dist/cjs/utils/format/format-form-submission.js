"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatFormSubmission = (form, data) => {
    const formattedFields = [];
    const fields = form.options.fields;
    for (let field of fields) {
        const fieldData = data.data.find((f) => f.name === field.name);
        if (!fieldData) {
            continue;
        }
        const value = fieldData.text_value || fieldData.number_value || fieldData.boolean_value;
        formattedFields.push({
            type: field.type,
            name: field.name,
            label: field.label,
            placeholder: field.placeholder,
            options: field.options,
            show_in_table: field.show_in_table,
            value: value,
        });
    }
    return {
        id: data.submission.id,
        form_key: data.submission.form_key,
        environment_key: data.submission.environment_key,
        read_at: data.submission.read_at,
        created_at: data.submission.created_at,
        updated_at: data.submission.updated_at,
        fields: formattedFields,
    };
};
exports.default = formatFormSubmission;
//# sourceMappingURL=format-form-submission.js.map