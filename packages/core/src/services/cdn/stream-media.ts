import T from "../../translations/index.js";
import {
	chooseAcceptHeaderFormat,
	generateProcessKey,
} from "../../utils/media/index.js";
import type { z } from "zod";
import type { Readable } from "node:stream";
import type cdnSchema from "../../schemas/cdn.js";
import type { ServiceFn } from "../../utils/services/types.js";

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
> = async (context, data) => {
	const format = chooseAcceptHeaderFormat(data.accept, data.query.format);

	const mediaStrategyRes =
		await context.services.media.checks.checkHasMediaStrategy(context);
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
					message: T("media_not_found_message"),
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
	const processKey = generateProcessKey({
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
	return await context.services.processedImage.processImage(context, {
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
