import { pathToFileURL } from "node:url";
import type { Config } from "./config-schema.js";
import getConfigPath from "./get-config-path.js";

let config: Config | undefined = undefined;

export const getConfig = async () => {
	if (config) {
		return config;
	}

	const configPath = getConfigPath(process.cwd());
	const configUrl = pathToFileURL(configPath).href;
	const configModule = await import(configUrl);

	config = configModule.default as Config;

	return config;
};

export default getConfig;
