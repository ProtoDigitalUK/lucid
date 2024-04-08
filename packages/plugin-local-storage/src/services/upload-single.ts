import T from "../translations/index.js";
import fs from "fs-extra";
import path from "node:path";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyUploadSingle } from "@protodigital/headless";

export default (pluginOptions: PluginOptions) => {
	const uploadSingle: MediaStrategyUploadSingle = async (props) => {
		// key example: 2024/01/gdfh4-banner
		// Meta includes extension

		const keyPath = props.key.split("/").slice(0, -1).join("/");
		const fileName = props.key.split("/").pop();

		if (!fileName) throw new Error("Invalid key"); // TODO: update message

		const uploadDir = path.join(pluginOptions.uploadDir, keyPath);

		await fs.ensureDir(uploadDir);

		const filePath = path.join(uploadDir, fileName);

		if (Buffer.isBuffer(props.data)) {
			await fs.writeFile(filePath, props.data);
		} else {
			const writeStream = fs.createWriteStream(filePath);
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
