// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import FormSubmission from "@db/models/FormSubmission";
// Serives
import formSubmissions from "@services/form-submissions";
import forms from "@services/forms";

export interface ServiceData {
  id: number;
  form_key: string;
  environment_key: string;
}

const deleteSingle = async (data: ServiceData) => {
  // Check if form is assigned to environment
  await formSubmissions.hasEnvironmentPermission({
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  // Delete form submission
  const formSubmission = await FormSubmission.deleteSingle({
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

  const formBuilder = forms.getBuilderInstance({
    form_key: data.form_key,
  });

  return formSubmissions.format(formBuilder, {
    submission: formSubmission,
    data: [],
  });
};

export default deleteSingle;
