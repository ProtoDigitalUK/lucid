// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import FormSubmission from "@db/models/FormSubmission";
// Services
import formSubmissions from "@services/form-submissions";
import forms from "@services/forms";

export interface ServiceData {
  id: number;
  form_key: string;
  environment_key: string;
}

const getSingle = async (data: ServiceData) => {
  // Check if form is assigned to environment
  await formSubmissions.hasEnvironmentPermission(data);

  const formSubmission = await FormSubmission.getSingle({
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  if (!formSubmission) {
    throw new LucidError({
      type: "basic",
      name: "Form Error",
      message: "This form submission does not exist.",
      status: 404,
    });
  }

  let formData = await FormSubmission.getAllFormData([formSubmission.id]);
  formData = formData.filter(
    (field) => field.form_submission_id === formSubmission.id
  );

  const formBuilder = forms.getBuilderInstance({
    form_key: formSubmission.form_key,
  });

  return formSubmissions.format(formBuilder, {
    submission: formSubmission,
    data: formData,
  });
};

export default getSingle;
