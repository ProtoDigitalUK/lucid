import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import { decodeError } from "../../utils/error-helpers.js";
import getConfig from "../../libs/config/get-config.js";
import path from "node:path";
import { getDirName } from "../../utils/helpers.js";
import fs from "fs-extra";
import cdnServices from "./index.js";

const currentDir = getDirName(import.meta.url);

export interface ServiceData {
	fallback?: "1" | "0";
	error: Error;
}

const streamErrorImage = async (data: ServiceData) => {
	const error = decodeError(data.error);

	if (error.status !== 404) {
		throw error;
	}

	const config = await getConfig();
	if (config.media?.fallbackImage === false || data.fallback === "0") {
		throw new LucidAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("media"),
			}),
			message: T("error_not_found_message", {
				name: T("media"),
			}),
			status: 404,
		});
	}

	if (config.media?.fallbackImage === undefined) {
		return pipeLocalImage();
	}

	try {
		const { buffer, contentType } = await cdnServices.pipeRemoteUrl({
			url: config.media?.fallbackImage as string,
		});

		return {
			body: buffer,
			contentType: contentType || "image/jpeg",
		};
	} catch (err) {
		return pipeLocalImage();
	}
};

const pipeLocalImage = () => {
	const pathVal = path.join(currentDir, "../assets/404.jpg");
	const contentType = "image/jpeg";

	const steam = fs.createReadStream(pathVal);

	return {
		body: steam,
		contentType: contentType,
	};
};

export default streamErrorImage;
