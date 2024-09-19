import type { LucidPluginOptions } from "@lucidcms/core/types";
import type { PluginOptions } from "./types/types.js";
import getS3Client from "./clients/s3-client.js";
import stream from "./services/steam.js";
import deletSingle from "./services/delete-single.js";
import deleteMultiple from "./services/delete-multiple.js";
import updateSingle from "./services/update-single.js";
import uploadSingle from "./services/upload-single.js";
import getPresignedUrl from "./services/get-presigned-url.js";
import { PLUGIN_KEY, LUCID_VERSION } from "./constants.js";

const plugin: LucidPluginOptions<PluginOptions> = async (
	config,
	pluginOptions,
) => {
	const client = getS3Client(pluginOptions);

	config.media = {
		...config.media,
		strategy: {
			getPresignedUrl: getPresignedUrl(client, pluginOptions),
			stream: stream(client, pluginOptions),
			uploadSingle: uploadSingle(client, pluginOptions),
			updateSingle: updateSingle(client, pluginOptions),
			deleteSingle: deletSingle(client, pluginOptions),
			deleteMultiple: deleteMultiple(client, pluginOptions),
		},
	};

	return {
		key: PLUGIN_KEY,
		lucid: LUCID_VERSION,
		config: config,
	};
};

export default plugin;
