import getConfigPath from "./get-config-path.js";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Config } from "../../types/config.js";

let config: Config | undefined = undefined;

export const getConfig = async (props?: {
	config?: Config;
	givenPath?: string;
}) => {
	if (props?.config) {
		config = props.config;
		return config;
	}

	if (config) {
		return config;
	}

	const configPath = props?.givenPath
		? props.givenPath
		: getConfigPath(process.cwd());
	const importPath = pathToFileURL(path.resolve(configPath)).href;
	const configModule = await import(/* @vite-ignore */ importPath);

	config = configModule.default as Config;

	return config;
};

export default getConfig;
