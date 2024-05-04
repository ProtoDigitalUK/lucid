import type { LucidConfig, Config } from "../../types/config.js";
import merge from "lodash.merge";

const mergeConfig = (
	config: LucidConfig,
	defaultConfig: Partial<LucidConfig>,
) => {
	return merge(defaultConfig, config) as Config;
};

export default mergeConfig;
