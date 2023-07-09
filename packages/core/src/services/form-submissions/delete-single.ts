// Models
import FormSubmission from "@db/models/FormSubmission";

export interface ServiceData {
  id: number;
  form_key: string;
  environment_key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const formSubmission = await FormSubmission.deleteSingle({
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  return formSubmission;
};

export default deleteSingle;
