import path from "node:path";
import getConfig from "../../libs/config/get-config.js";
import { getDirName } from "../../utils/helpers/index.js";

const currentDir = getDirName(import.meta.url);

const getBasicConfig = async () => {
	const config = await getConfig(
		path.resolve(currentDir, "./config/lucid.config.ts"),
	);

	return config;
};

const testConfig = {
	basic: getBasicConfig,
};

export default testConfig;
