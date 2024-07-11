import getConfigPath from "./get-config-path.js";
import path from "node:path";
import type { Config } from "../../types/config.js";

let config: Config | undefined = undefined;

export const getConfig = async (givenPath?: string) => {
	if (config) {
		return config;
	}

	const configPath = givenPath ? givenPath : getConfigPath(process.cwd());
	const importPath = path.resolve(configPath);
	const configModule = await import(/* @vite-ignore */ importPath);

	config = configModule.default as Config;

	return config;
};

export default getConfig;
