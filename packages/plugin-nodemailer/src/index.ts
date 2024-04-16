import type { Config } from "@protoheadless/headless/types";
import type { PluginOptions } from "./types/types.js";
import plugin from "./plugin.js";

const headlessNodemailerPlugin =
	(pluginOptions: PluginOptions) => (config: Config) =>
		plugin(config, pluginOptions);

export default headlessNodemailerPlugin;
