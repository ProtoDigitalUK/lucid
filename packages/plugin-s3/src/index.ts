import type { Config } from "@protoheadless/headless";
import type { PluginOptions } from "./types/types.js";
import plugin from "./plugin.js";

const headlessS3Plugin =
	(pluginOptions: PluginOptions) =>
	(config: Config): Promise<Config> =>
		plugin(config, pluginOptions);

export default headlessS3Plugin;
