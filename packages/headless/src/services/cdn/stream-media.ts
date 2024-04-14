import T from "../../translations/index.js";
import type { z } from "zod";
import type { Readable } from "node:stream";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import type cdnSchema from "../../schemas/cdn.js";
import mediaHelpers from "../../utils/media-helpers.js";
import processedImageServices from "../processed-images/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "../media/index.js";

export interface ServiceData {
	key: string;
	query: z.infer<typeof cdnSchema.streamSingle.query>;
	accept: string | undefined;
}

const streamMedia = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
): Promise<{
	key: string;
	contentLength: number | undefined;
	contentType: string | undefined;
	body: Readable;
}> => {
	const format = mediaHelpers.chooseFormat(data.accept, data.query.format);

	const mediaStategy = mediaServices.checks.checkHasMediaStrategy({
		config: serviceConfig.config,
	});

	// ------------------------------
	// OG Image
	if (
		format === undefined &&
		data.query?.width === undefined &&
		data.query?.height === undefined &&
		data.query?.quality === undefined
	) {
		const res = await mediaStategy.stream(data.key);

		if (!res.success || !res.response) {
			throw new HeadlessAPIError({
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
		return {
			key: data.key,
			contentLength: res.response.contentLength,
			contentType: res.response.contentType,
			body: res.response.body,
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
	const res = await mediaStategy.stream(processKey);

	if (res.success && res.response) {
		return {
			key: processKey,
			contentLength: res.response.contentLength,
			contentType: res.response.contentType,
			body: res.response.body,
		};
	}

	// Process
	return await serviceWrapper(processedImageServices.processImage, false)(
		serviceConfig,
		{
			key: data.key,
			processKey: processKey,
			options: {
				format,
				quality: data.query.quality,
				width: data.query.width,
				height: data.query.height,
			},
		},
	);
};

export default streamMedia;
