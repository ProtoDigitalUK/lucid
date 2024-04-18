import { pathToFileURL } from "node:url";
import getConfigPath from "./get-config-path.js";
import type { Config } from "../../types/config.js";

let config: Config | undefined = undefined;

export const getConfig = async (path?: string) => {
	if (config) {
		return config;
	}

	const configPath = path ? path : getConfigPath(process.cwd());
	const configUrl = pathToFileURL(configPath).href;
	const configModule = await import(configUrl);

	config = configModule.default as Config;

	return config;
};

export default getConfig;
