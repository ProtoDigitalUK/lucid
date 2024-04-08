import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUpdateSingle } from "@protodigital/headless";
import uploadSingle from "./upload-single.js";

export default (pluginOptions: PluginOptions) => {
	const updateSingle: MediaStrategyUpdateSingle = async (oldKey, props) => {
		try {
			const uploadRes = await uploadSingle(pluginOptions)(props);

			if (oldKey !== props.key) {
				// delete single
			}

			return uploadRes;
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
				response: null,
			};
		}
	};

	return updateSingle;
};
