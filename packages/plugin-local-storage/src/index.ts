import type { Config } from "@protoheadless/headless";
import type { PluginOptions } from "./types/types.js";
import plugin from "./plugin.js";

const headlessLocalStorage =
	(pluginOptions: PluginOptions) =>
	(config: Config): Promise<Config> =>
		plugin(config, pluginOptions);

export default headlessLocalStorage;
