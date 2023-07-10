// Models
import Option from "@db/models/Option";

const getStorageUsed = async () => {
  const res = await Option.getByName("media_storage_used");
  return res.option_value as number;
};

export default getStorageUsed;
