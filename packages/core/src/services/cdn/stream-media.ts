import T from "../../translations/index.js";
import mediaHelpers from "../../utils/media-helpers.js";
import LucidServices from "../index.js";
import type { z } from "zod";
import type { Readable } from "node:stream";
import type cdnSchema from "../../schemas/cdn.js";
import type { ServiceFn } from "../../libs/services/types.js";

const streamMedia: ServiceFn<
	[
		{
			key: string;
			query: z.infer<typeof cdnSchema.streamSingle.query>;
			accept: string | undefined;
		},
	],
	{
		key: string;
		contentLength: number | undefined;
		contentType: string | undefined;
		body: Readable;
	}
> = async (service, data) => {
	const format = mediaHelpers.chooseFormat(data.accept, data.query.format);

	const mediaStrategyRes =
		await LucidServices.media.checks.checkHasMediaStrategy(service);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	// ------------------------------
	// OG Image
	if (
		format === undefined &&
		data.query?.width === undefined &&
		data.query?.height === undefined &&
		data.query?.quality === undefined
	) {
		const res = await mediaStrategyRes.data.stream(data.key);

		if (!res.success || !res.response) {
			return {
				error: {
					type: "basic",
					name: T("error_not_found_name", {
						name: T("media"),
					}),
					message: T("error_not_found_message", {
						name: T("media"),
					}),
					status: 404,
				},
				data: undefined,
			};
		}
		return {
			error: undefined,
			data: {
				key: data.key,
				contentLength: res.response.contentLength,
				contentType: res.response.contentType,
				body: res.response.body,
			},
		};
	}

	// ------------------------------
	// Processed Image
	const processKey = mediaHelpers.generateProcessKey({
		key: data.key,
		options: {
			format,
			quality: data.query.quality,
			width: data.query.width,
			height: data.query.height,
		},
	});

	// Try and stream the processed media (may already exist)
	const res = await mediaStrategyRes.data.stream(processKey);

	if (res.success && res.response) {
		return {
			error: undefined,
			data: {
				key: processKey,
				contentLength: res.response.contentLength,
				contentType: res.response.contentType,
				body: res.response.body,
			},
		};
	}

	// Process
	return await LucidServices.processedImage.processImage(service, {
		key: data.key,
		processKey: processKey,
		options: {
			format,
			quality: data.query.quality,
			width: data.query.width,
			height: data.query.height,
		},
	});
};

export default streamMedia;
