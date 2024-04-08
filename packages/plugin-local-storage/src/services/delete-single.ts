import T from "../translations/index.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteSingle } from "@protodigital/headless";

export default (pluginOptions: PluginOptions) => {
	const deletSingle: MediaStrategyDeleteSingle = async (key) => {
		try {
			return {
				success: true,
				message: T("file_deleted_successfully_single"),
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
			};
		}
	};

	return deletSingle;
};
