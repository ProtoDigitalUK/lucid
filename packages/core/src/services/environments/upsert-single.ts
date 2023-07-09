// Models
import Environment from "@db/models/Environment";

export interface ServiceData {
  data: {
    key: string;
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
  };
  create: boolean;
}

const upsertSingle = async (data: ServiceData) => {
  const environment = await Environment.upsertSingle(data.data, data.create);

  return environment;
};

export default upsertSingle;
