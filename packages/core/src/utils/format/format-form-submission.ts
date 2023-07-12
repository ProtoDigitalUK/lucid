// Models
import { FormDataT, FormSubmissionsT } from "@db/models/FormSubmission";
// Extenal Packages
import FormBuilder from "@lucid/form-builder";

// ----------------
// Types
export interface FormSubmissionResT {
  id: number; // submission_id
  form_key: string;
  environment_key: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  fields: Array<{
    type: string;
    name: string;
    label: string;
    placeholder?: string;
    options?: Array<{
      label: string;
      value: string;
    }>;
    show_in_table?: boolean;
    value: string | number | boolean;
  }>;
}

const formatFormSubmission = (
  form: FormBuilder,
  data: {
    submission: FormSubmissionsT;
    data: FormDataT[];
  }
): FormSubmissionResT => {
  const formattedFields: FormSubmissionResT["fields"] = [];
  const fields = form.options.fields;

  for (let field of fields) {
    const fieldData = data.data.find((f) => f.name === field.name);

    if (!fieldData) {
      continue;
    }

    const value =
      fieldData.text_value || fieldData.number_value || fieldData.boolean_value;

    formattedFields.push({
      type: field.type,
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      options: field.options,
      show_in_table: field.show_in_table,
      value: value as string | number | boolean,
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

export default formatFormSubmission;
