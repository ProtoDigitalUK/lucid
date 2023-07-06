import getDBClient from "@db/db";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Models
import Config from "@db/models/Config";
// Serices
import {
  formatFormSubmission,
  FormSubmissionResT,
} from "@services/forms/format-form";

// -------------------------------------------
// Types
type FormDataCreateSingle = (data: {
  id?: number;
  form_key: string;
  environment_key: string;
  data: Array<{
    name: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
  }>;
}) => Promise<FormSubmissionResT>;

// -------------------------------------------
// Form
export type FormSubmissionsT = {
  id: number;
  form_key: string;
  environment_key: string;

  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FormDataT = {
  id: number;
  form_submission_id: string;

  name: string;
  text_value: string | null;
  number_value: number | null;
  boolean_value: boolean | null;

  created_at: string;
  updated_at: string;
};

export default class Form {
  // -------------------------------------------
  // Functions
  static createSingle: FormDataCreateSingle = async (data) => {
    const formBuilder = await Form.#getFormBuilder(data.form_key);

    // Create form submission
    const formSubmission = await Form.#createNewFormSubmission({
      form_key: data.form_key,
      environment_key: data.environment_key,
    });

    // Create form data
    const formData = await Promise.all(
      data.data.map((field) =>
        Form.#createNewFormData({
          form_submission_id: formSubmission.id,
          name: field.name,
          type: field.type,
          value: field.value,
        })
      )
    );

    const formDataRes = formData.map((field) => field.rows[0]);

    return formatFormSubmission(formBuilder, {
      submission: formSubmission,
      data: formDataRes,
    });
  };
  // -------------------------------------------
  // Util Functions
  static #getFormBuilder = async (form_key: string) => {
    const FormBuilderInstances = Config.forms || [];

    const form = FormBuilderInstances.find((form) => form.key === form_key);

    if (!form) {
      throw new LucidError({
        type: "basic",
        name: "Form Error",
        message: "Form not found.",
        status: 404,
      });
    }

    return form;
  };
  static #createNewFormSubmission = async (data: {
    form_key: string;
    environment_key: string;
  }) => {
    const client = await getDBClient;

    const { columns, aliases, values } = queryDataFormat({
      columns: ["form_key", "environment_key"],
      values: [data.form_key, data.environment_key],
    });

    const res = await client.query<FormSubmissionsT>({
      text: `INSERT INTO lucid_form_submissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    if (res.rows.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "Form Submission Error",
        message: "Failed to create form submission entry.",
        status: 500,
      });
    }

    return res.rows[0];
  };
  static #createNewFormData = async (data: {
    form_submission_id: number;
    name: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
  }) => {
    const client = await getDBClient;

    const { columns, aliases, values } = queryDataFormat({
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

    return client.query<FormDataT>({
      text: `INSERT INTO lucid_form_data (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });
  };
}
