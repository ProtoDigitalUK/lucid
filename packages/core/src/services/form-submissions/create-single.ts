// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import FormSubmission from "@db/models/FormSubmission";
// Services
import formSubService from "@services/form-submissions";
import formsService from "@services/forms";

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

const createSingle = async (data: ServiceData) => {
  // Check if form is assigned to environment
  await formSubService.hasEnvironmentPermission(data);

  const formBuilder = formsService.getBuilderInstance({
    form_key: data.form_key,
  });

  // Create form submission
  const formSubmission = await FormSubmission.createSingle({
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  if (!formSubmission) {
    throw new LucidError({
      type: "basic",
      name: "Form Submission Error",
      message: "Failed to create form submission entry.",
      status: 500,
    });
  }

  // Create form data
  const formData = await Promise.all(
    data.data.map((field) =>
      FormSubmission.createFormData({
        form_submission_id: formSubmission.id,
        name: field.name,
        type: field.type,
        value: field.value,
      })
    )
  );

  return formSubService.format(formBuilder, {
    submission: formSubmission,
    data: formData,
  });
};

export default createSingle;
