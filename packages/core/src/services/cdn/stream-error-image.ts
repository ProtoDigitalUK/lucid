import T from "../../translations/index.js";
import path from "node:path";
import fs from "fs-extra";
import pipeRemoteUrl from "./helpers/pipe-remote-url.js";
import { getDirName } from "../../utils/helpers.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { LucidErrorData } from "../../types/errors.js";

const currentDir = getDirName(import.meta.url);

const streamErrorImage: ServiceFn<
	[
		{
			fallback?: "1" | "0";
			error: LucidErrorData;
		},
	],
	{
		body: fs.ReadStream | Buffer;
		contentType: string;
	}
> = async (service, data) => {
	if (data.error.status !== 404) {
		return {
			error: data.error,
			data: undefined,
		};
	}

	if (
		service.config.media?.fallbackImage === false ||
		data.fallback === "0"
	) {
		return {
			error: {
				type: "basic",
				message: T("media_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	if (service.config.media?.fallbackImage === undefined) {
		return {
			error: undefined,
			data: pipeLocalImage(),
		};
	}

	try {
		const { buffer, contentType } = await pipeRemoteUrl({
			url: service.config.media?.fallbackImage as string,
		});

		return {
			error: undefined,
			data: {
				body: buffer,
				contentType: contentType || "image/jpeg",
			},
		};
	} catch (err) {
		return {
			error: undefined,
			data: pipeLocalImage(),
		};
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
