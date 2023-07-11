// Models
import Option from "@db/models/Option";
// Services
import mediaService from "@services/media";

export interface ServiceData {
  add: number;
  minus?: number;
}

const getStorageUsed = async (data: ServiceData) => {
  const storageUsed = await mediaService.getStorageUsed();

  let newValue = storageUsed + data.add;
  if (data.minus !== undefined) {
    newValue = newValue - data.minus;
  }
  const res = await Option.patchByName({
    name: "media_storage_used",
    value: newValue,
    type: "number",
  });
  return res.option_value as number;
};

export default getStorageUsed;
