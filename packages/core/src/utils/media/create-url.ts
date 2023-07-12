// Services
import Config from "@services/Config";

const createURL = (key?: string) => {
  if (!key) {
    return undefined;
  }
  return `${Config.host}/api/media/${key}`;
};

export default createURL;
