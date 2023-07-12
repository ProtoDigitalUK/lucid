// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import FormSubmission from "@db/models/FormSubmission";
// Services
import formSubService from "@services/form-submissions";
import formsService from "@services/forms";
// Format
import formatFormSubmission from "@utils/format/format-form-submission";

export interface ServiceData {
  id: number;
  form_key: string;
  environment_key: string;
}

const toggleReadAt = async (data: ServiceData) => {
  // Check if form is assigned to environment
  await formSubService.hasEnvironmentPermission({
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  // Get form submission
  const formSubmission = await formSubService.getSingle({
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  const updateFormSubmission = await FormSubmission.toggleReadAt({
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key,
    read_at: formSubmission.read_at ? null : new Date(),
  });

  if (!updateFormSubmission) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "This form submission does not exist.",
      status: 404,
    });
  }

  let formData = await FormSubmission.getAllFormData([updateFormSubmission.id]);
  formData = formData.filter(
    (field) => field.form_submission_id === updateFormSubmission.id
  );

  const formBuilder = formsService.getBuilderInstance({
    form_key: updateFormSubmission.form_key,
  });

  return formatFormSubmission(formBuilder, {
    submission: updateFormSubmission,
    data: formData,
  });
};

export default toggleReadAt;
