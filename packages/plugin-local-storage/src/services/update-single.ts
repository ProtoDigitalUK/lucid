import fs from "fs-extra";
import { keyPaths } from "../utils/helpers.js";
import uploadSingle from "./upload-single.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUpdateSingle } from "@protoheadless/core/types";

export default (pluginOptions: PluginOptions) => {
	const updateSingle: MediaStrategyUpdateSingle = async (oldKey, props) => {
		try {
			const uploadRes = await uploadSingle(pluginOptions)(props);

			if (oldKey !== props.key) {
				const { targetPath } = keyPaths(
					oldKey,
					pluginOptions.uploadDir,
				);
				const exists = await fs.pathExists(targetPath);
				if (exists) {
					await fs.unlink(targetPath);
				}
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
