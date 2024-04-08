import T from "../translations/index.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyDeleteMultiple } from "@protodigital/headless";

export default (pluginOptions: PluginOptions) => {
	const deleteMultiple: MediaStrategyDeleteMultiple = async (keys) => {
		try {
			return {
				success: true,
				message: T("file_deleted_successfully_multiple"),
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
			};
		}
	};

	return deleteMultiple;
};
