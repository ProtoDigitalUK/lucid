// Services
import deleteSingle from "./delete-single";
import getMultiple from "./get-multiple";
import getSingle from "./get-single";
import toggleReadAt from "./toggle-read-at";
import format from "./format";
import submitForm from "./submit-form";
import hasEnvironmentPermission from "./has-environment-permission";
import createSingle from "./create-single";

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

// ----------------
// Exports
export default {
  deleteSingle,
  getMultiple,
  getSingle,
  toggleReadAt,
  format,
  submitForm,
  hasEnvironmentPermission,
  createSingle,
};
