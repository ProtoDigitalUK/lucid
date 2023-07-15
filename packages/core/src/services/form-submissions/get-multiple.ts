import z from "zod";
// Models
import FormSubmission, { FormDataT } from "@db/models/FormSubmission";
// Schema
import formSubmissionsSchema from "@schemas/form-submissions";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";
// Services
import formSubService from "@services/form-submissions";
import formsService from "@services/forms";
// Format
import formatFormSubmission from "@utils/format/format-form-submission";

export interface ServiceData {
  query: z.infer<typeof formSubmissionsSchema.getMultiple.query>;
  form_key: string;
  environment_key: string;
}

const getMultiple = async (data: ServiceData) => {
  // Check if form is assigned to environment
  await formSubService.hasEnvironmentPermission(data);

  const { sort, include, page, per_page } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
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

  const formSubmissionsRes = await FormSubmission.getMultiple(SelectQuery);

  // Get Form Data
  const formBuilder = formsService.getBuilderInstance({
    form_key: data.form_key,
  });

  let formData: FormDataT[] = [];

  if (include?.includes("fields")) {
    const formSubmissionIds = formSubmissionsRes.data.map(
      (submission) => submission.id
    );
    formData = await FormSubmission.getAllFormData({
      submission_ids: formSubmissionIds,
    });
  }

  const formattedSubmissions = formSubmissionsRes.data.map((submission) => {
    return formatFormSubmission(formBuilder, {
      submission,
      data: formData.filter(
        (field) => field.form_submission_id === submission.id
      ),
    });
  });

  return {
    data: formattedSubmissions,
    count: formSubmissionsRes.count,
  };
};

export default getMultiple;
