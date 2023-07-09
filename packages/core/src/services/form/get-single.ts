// Models
import Form from "@db/models/Form";

export interface ServiceData {
  key: string;
  environment_key: string;
}

const getSingle = async (data: ServiceData) => {
  const form = await Form.getSingle({
    key: data.key,
    environment_key: data.environment_key,
  });

  return form;
};

export default getSingle;
