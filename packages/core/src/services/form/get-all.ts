import z from "zod";
// Models
import Form from "@db/models/Form";
// Schema
import formsSchema from "@schemas/forms";

export interface ServiceData {
  query: z.infer<typeof formsSchema.getAll.query>;
  environment_key: string;
}

const getAll = async (data: ServiceData) => {
  const forms = await Form.getAll(data.query, data.environment_key);

  return forms;
};

export default getAll;
