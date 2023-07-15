import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Services
import mediaService from "@services/media";
import optionService from "@services/options";

export interface ServiceData {
  add: number;
  minus?: number;
}

const getStorageUsed = async (client: PoolClient, data: ServiceData) => {
  const storageUsed = await service(
    mediaService.getStorageUsed,
    false,
    client
  )();

  let newValue = storageUsed + data.add;
  if (data.minus !== undefined) {
    newValue = newValue - data.minus;
  }
  const res = await service(
    optionService.patchByName,
    false,
    client
  )({
    name: "media_storage_used",
    value: newValue,
    type: "number",
  });
  return res.option_value as number;
};

export default getStorageUsed;
