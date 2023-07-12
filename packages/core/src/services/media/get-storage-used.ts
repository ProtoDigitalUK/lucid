// Services
import optionServices from "@services/options";

const getStorageUsed = async () => {
  const res = await optionServices.getByName({
    name: "media_storage_used",
  });
  return res.option_value as number;
};

export default getStorageUsed;
