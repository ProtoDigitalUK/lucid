import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Services
import optionServices from "@services/options/index.js";

const getStorageUsed = async (client: PoolClient) => {
  const res = await service(
    optionServices.getByName,
    false,
    client
  )({
    name: "media_storage_used",
  });
  return res.media_storage_used;
};

export default getStorageUsed;
