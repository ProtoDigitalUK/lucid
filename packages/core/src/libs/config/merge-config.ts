import type { HeadlessConfig, Config } from "../../types/config.js";
import merge from "lodash.merge";

const mergeConfig = (
	config: HeadlessConfig,
	defaultConfig: Partial<HeadlessConfig>,
) => {
	return merge(defaultConfig, config) as Config;
};

export default mergeConfig;
