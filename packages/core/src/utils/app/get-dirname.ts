import { fileURLToPath } from "url";
import { dirname } from "path";

const getDirName = (metaUrl: string) => {
  return dirname(fileURLToPath(metaUrl));
};

export default getDirName;
