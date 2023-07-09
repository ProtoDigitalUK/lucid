// Models
import Config from "@db/models/Config";

const createURL = (key?: string) => {
  if (!key) {
    return undefined;
  }
  return `${Config.host}/api/media/${key}`;
};

export default createURL;
