import z from "zod";
// Models
import FormSubmission from "@db/models/FormSubmission";
// Schema
import formSubmissionsSchema from "@schemas/form-submissions";

export interface ServiceData {
  query: z.infer<typeof formSubmissionsSchema.getMultiple.query>;
  form_key: string;
  environment_key: string;
}

const getMultiple = async (data: ServiceData) => {
  const formSubmissions = await FormSubmission.getMultiple(data.query, {
    form_key: data.form_key,
    environment_key: data.environment_key,
  });

  return formSubmissions;
};

export default getMultiple;
