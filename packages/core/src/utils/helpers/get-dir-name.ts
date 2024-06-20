import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const getDirName = (metaUrl: string) => {
	return dirname(fileURLToPath(metaUrl));
};

export default getDirName;
