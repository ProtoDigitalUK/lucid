// Models
import Config from "@db/models/Config";

const createURL = (key?: string) => {
  if (!key) {
    return undefined;
  }
  return `${Config.host}/cdn/${key}`;
};

export default createURL;
