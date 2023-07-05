import FormBuilder from "@lucid/form-builder";
// Models
import Form from "@db/models/Form";

interface SubmissionDataT {
  [key: string]: string | number | boolean;
}

export const saveFormSubmission = async (
  form: FormBuilder,
  data: SubmissionDataT
) => {
  /*
        Forms have 3 tables in the DB:

        1. Form Types
        2. Form Fields
        3. Form Data


        ! Form Types
        For each unique form.key, there is a form type, if the name and description are different, update them.

        ! Form Fields
        For each field in the form, create or update a form field, never delete ones that are not present as they may be used in previous submissions.

        ! Form Data
        For the all form data, create a new form data row that stores the value and the form field id it belongs to.


        ===================================¬
        | If all went well, return success |
    */

  await Form.upsertSingle({});
};
