import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import FormSubmission from "@db/models/FormSubmission.js";
// Services
import formSubService from "@services/form-submissions/index.js";
import formsService from "@services/forms/index.js";
// Format
import formatFormSubmission from "@utils/format/format-form-submission.js";

export interface ServiceData {
  id?: number;
  form_key: string;
  environment_key: string;
  data: Array<{
    name: string;
    type: "string" | "number" | "boolean";
    value: string | number | boolean;
  }>;
}

const createSingle = async (client: PoolClient, data: ServiceData) => {
  // Check if form is assigned to environment
  await service(formSubService.hasEnvironmentPermission, false, client)(data);

  const formBuilder = formsService.getBuilderInstance({
    form_key: data.form_key,
  });

  // Create form submission
  const formSubmission = await FormSubmission.createSingle(client, {
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  if (!formSubmission) {
    throw new HeadlessError({
      type: "basic",
      name: "Form Submission Error",
      message: "Failed to create form submission entry.",
      status: 500,
    });
  }

  // Create form data
  const formData = await Promise.all(
    data.data.map((field) =>
      FormSubmission.createFormData(client, {
        form_submission_id: formSubmission.id,
        name: field.name,
        type: field.type,
        value: field.value,
      })
    )
  );

  return formatFormSubmission(formBuilder, {
    submission: formSubmission,
    data: formData,
  });
};

export default createSingle;
