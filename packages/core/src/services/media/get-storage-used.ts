import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Services
import optionServices from "@services/options";

const getStorageUsed = async (client: PoolClient) => {
  const res = await service(
    optionServices.getByName,
    false,
    client
  )({
    name: "media_storage_used",
  });
  return res.option_value as number;
};

export default getStorageUsed;
