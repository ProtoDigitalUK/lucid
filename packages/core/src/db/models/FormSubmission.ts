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
import Environment from "./Environment";

// -------------------------------------------
// Types
type FormSubmissionCreateSingle = (data: {
  id?: number;
  form_key: string;
  environment_key: string;
  data: Array<{
    name: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
  }>;
}) => Promise<FormSubmissionResT>;

type FormSubmissionGetSingle = (data: {
  id: number;
  form_key: string;
  environment_key: string;
}) => Promise<FormSubmissionResT>;

type FormSubmissionGetMultiple = (data: {}) => Promise<FormSubmissionResT>;

type FormSubmissionUpdateSingle = (data: {}) => Promise<FormSubmissionResT>;

// -------------------------------------------
// Form Submission
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
  form_submission_id: number;

  name: string;
  text_value: string | null;
  number_value: number | null;
  boolean_value: boolean | null;

  created_at: string;
  updated_at: string;
};

export default class FormSubmission {
  // -------------------------------------------
  // Functions
  static createSingle: FormSubmissionCreateSingle = async (data) => {
    // Check if form is assigned to environment
    await FormSubmission.#checkFormEnvrionmentPermissions(data);

    const formBuilder = await FormSubmission.#getFormBuilder(data.form_key);

    // Create form submission
    const formSubmission = await FormSubmission.#createNewFormSubmission({
      form_key: data.form_key,
      environment_key: data.environment_key,
    });

    // Create form data
    const formData = await Promise.all(
      data.data.map((field) =>
        FormSubmission.#createNewFormData({
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
  static getSingle: FormSubmissionGetSingle = async (data) => {
    const client = await getDBClient;

    // Check if form is assigned to environment
    await FormSubmission.#checkFormEnvrionmentPermissions(data);

    // Get form submission
    const formSubmission = await client.query<FormSubmissionsT>({
      text: `SELECT * FROM lucid_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3;`,
      values: [data.id, data.form_key, data.environment_key],
    });

    if (!formSubmission.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Form Error",
        message: "This form submission does not exist.",
        status: 404,
      });
    }

    let formData = await FormSubmission.#getAllFormData([
      formSubmission.rows[0].id,
    ]);
    formData = formData.filter(
      (field) => field.form_submission_id === formSubmission.rows[0].id
    );

    const formBuilder = await FormSubmission.#getFormBuilder(
      formSubmission.rows[0].form_key
    );

    return formatFormSubmission(formBuilder, {
      submission: formSubmission.rows[0],
      data: formData,
    });
  };
  static getMultiple: FormSubmissionGetMultiple = async (data) => {
    return {} as FormSubmissionResT;
  };
  static updateSingle: FormSubmissionUpdateSingle = async (data) => {
    return {} as FormSubmissionResT;
  };
  // -------------------------------------------
  // Util Functions
  static #checkFormEnvrionmentPermissions = async (data: {
    form_key: string;
    environment_key: string;
  }) => {
    const environment = await Environment.getSingle(data.environment_key);

    const hasPerm = environment.assigned_forms?.includes(data.form_key);

    if (!hasPerm) {
      throw new LucidError({
        type: "basic",
        name: "Form Error",
        message: "This form is not assigned to this environment.",
        status: 403,
      });
    }

    return environment;
  };
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
  static #getAllFormData = async (submission_ids: number[]) => {
    const client = await getDBClient;

    const res = await client.query<FormDataT>({
      text: `SELECT * FROM lucid_form_data WHERE form_submission_id = ANY($1)`,
      values: [submission_ids],
    });

    if (res.rows.length === 0) {
      return [];
    }

    return res.rows;
  };
  static #checkFormEnvrionmentAccess = async (data: {
    form_key: string;
    environment_key: string;
  }) => {
    const environment = await Environment.getSingle(data.environment_key);

    const hasPerm = environment.assigned_forms?.includes(data.form_key);

    if (!hasPerm) {
      throw new LucidError({
        type: "basic",
        name: "Form Error",
        message: "This form is not assigned to this environment.",
        status: 403,
      });
    }

    return environment;
  };
}
