import T from "../translations/index.js";
import fs from "fs-extra";
import { keyPaths } from "../utils/helpers.js";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUploadSingle } from "@lucidcms/core/types";

export default (pluginOptions: PluginOptions) => {
	const uploadSingle: MediaStrategyUploadSingle = async (props) => {
		const { targetDir, targetPath } = keyPaths(
			props.key,
			pluginOptions.uploadDir,
		);

		await fs.ensureDir(targetDir);

		if (Buffer.isBuffer(props.data)) {
			await fs.writeFile(targetPath, props.data);
		} else {
			const writeStream = fs.createWriteStream(targetPath);
			props.data.pipe(writeStream);
			await new Promise((resolve, reject) => {
				writeStream.on("finish", resolve);
				writeStream.on("error", reject);
			});
		}

		try {
			return {
				success: true,
				message: T("file_saved_successfully"),
				response: null,
			};
		} catch (e) {
			const error = e as Error;
			return {
				success: false,
				message: error.message,
				response: null,
			};
		}
	};

	return uploadSingle;
};
