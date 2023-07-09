// Models
import FormSubmission from "@db/models/FormSubmission";

interface ServiceData {
  id: number;
  form_key: string;
  environment_key: string;
}

const getSingle = async (data: ServiceData) => {
  const formSubmission = await FormSubmission.getSingle({
    id: data.id,
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  return formSubmission;
};

export default getSingle;
