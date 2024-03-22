import { pathToFileURL } from "node:url";
import type { HeadlessConfigT } from "../../schemas/config.js";
import getConfigPath from "./get-config-path.js";

let config: HeadlessConfigT | undefined = undefined;

export const getConfig = async () => {
	if (config) {
		return config;
	}

	const configPath = getConfigPath(process.cwd());
	const configUrl = pathToFileURL(configPath).href;
	const configModule = await import(configUrl);

	config = configModule.default as HeadlessConfigT;

	return config;
};

export default getConfig;
