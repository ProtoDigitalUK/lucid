// Services
import Config from "@services/Config";

const createURL = (key?: string) => {
  if (!key) {
    return undefined;
  }
  return `${Config.host}/cdn/v1/${key}`;
};

export default createURL;
