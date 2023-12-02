import { PoolClient } from "pg";
// Utils
import {
  queryDataFormat,
  SelectQueryBuilder,
} from "@utils/app/query-helpers.js";

// -------------------------------------------
// Types
type FormSubmissionCreateSingle = (
  client: PoolClient,
  data: {
    form_key: string;
    environment_key: string;
  }
) => Promise<FormSubmissionsT>;

type FormSubmissionCreateFormData = (
  client: PoolClient,
  data: {
    form_submission_id: number;
    name: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
  }
) => Promise<FormDataT>;

type FormSubmissionGetSingle = (
  client: PoolClient,
  data: {
    id: number;
    form_key: string;
    environment_key: string;
  }
) => Promise<FormSubmissionsT>;

type FormSubmissionGetMultiple = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<{
  data: FormSubmissionsT[];
  count: number;
}>;

type FormSubmissionToggleReadAt = (
  client: PoolClient,
  data: {
    id: number;
    form_key: string;
    environment_key: string;
    read_at: Date | null;
  }
) => Promise<FormSubmissionsT>;

type FormSubmissionDeleteSingle = (
  client: PoolClient,
  data: {
    id: number;
    form_key: string;
    environment_key: string;
  }
) => Promise<FormSubmissionsT>;

type FormSubmissionGetAllFormData = (
  client: PoolClient,
  data: {
    submission_ids: number[];
  }
) => Promise<FormDataT[]>;

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
  // Submissions
  static createSingle: FormSubmissionCreateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["form_key", "environment_key"],
      values: [data.form_key, data.environment_key],
    });

    const res = await client.query<FormSubmissionsT>({
      text: `INSERT INTO headless_form_submissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return res.rows[0];
  };
  static getSingle: FormSubmissionGetSingle = async (client, data) => {
    // Get form submission
    const formSubmission = await client.query<FormSubmissionsT>({
      text: `SELECT * FROM headless_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3;`,
      values: [data.id, data.form_key, data.environment_key],
    });

    return formSubmission.rows[0];
  };
  static getMultiple: FormSubmissionGetMultiple = async (
    client,
    query_instance
  ) => {
    const submissions = client.query<FormSubmissionsT>({
      text: `SELECT ${query_instance.query.select} FROM headless_form_submissions ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });
    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(DISTINCT headless_form_submissions.id) FROM headless_form_submissions ${query_instance.query.where} `,
      values: query_instance.countValues,
    });

    const data = await Promise.all([submissions, count]);

    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count),
    };
  };
  static toggleReadAt: FormSubmissionToggleReadAt = async (client, data) => {
    // Update form submission
    const updatedFormSubmission = await client.query<FormSubmissionsT>({
      text: `UPDATE headless_form_submissions SET read_at = $1 WHERE id = $2 AND form_key = $3 AND environment_key = $4 RETURNING *;`,
      values: [data.read_at, data.id, data.form_key, data.environment_key],
    });

    return updatedFormSubmission.rows[0];
  };
  static deleteSingle: FormSubmissionDeleteSingle = async (client, data) => {
    // Delete form submission
    const formSubmission = await client.query<FormSubmissionsT>({
      text: `DELETE FROM headless_form_submissions WHERE id = $1 AND form_key = $2 AND environment_key = $3 RETURNING *;`,
      values: [data.id, data.form_key, data.environment_key],
    });

    return formSubmission.rows[0];
  };
  // -------------------------------------------
  // Submission Data
  static createFormData: FormSubmissionCreateFormData = async (
    client,
    data
  ) => {
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

    const formData = await client.query<FormDataT>({
      text: `INSERT INTO headless_form_data (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return formData.rows[0];
  };
  static getAllFormData: FormSubmissionGetAllFormData = async (
    client,
    data
  ) => {
    const res = await client.query<FormDataT>({
      text: `SELECT * FROM headless_form_data WHERE form_submission_id = ANY($1)`,
      values: [data.submission_ids],
    });

    return res.rows;
  };
}
