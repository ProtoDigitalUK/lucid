import T from "../../translations/index.js";
import type z from "zod";
import type cdnSchema from "../../schemas/cdn.js";
import { PassThrough, type Readable } from "node:stream";
import processedImageServices from "./index.js";
import mediaHelpers from "../../utils/media-helpers.js";
import Repository from "../../libs/repositories/index.js";
import mediaServices from "../media/index.js";
import optionsServices from "../options/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const processImage: ServiceFn<
	[
		{
			key: string;
			processKey: string;
			options: z.infer<typeof cdnSchema.streamSingle.query>;
		},
	],
	{
		key: string;
		contentLength: number | undefined;
		contentType: string | undefined;
		body: Readable;
	}
> = async (serviceConfig, data) => {
	const mediaStrategyRes =
		await mediaServices.checks.checkHasMediaStrategy(serviceConfig);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	// get og image
	const res = await mediaStrategyRes.data.stream(data.key);

	// If there is no response
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

	// If the response is not an image
	if (!res.response?.contentType?.startsWith("image/")) {
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

	// Optimise image
	const [imageRes, processedCountRes] = await Promise.all([
		processedImageServices.optimiseImage(serviceConfig, {
			buffer: await mediaHelpers.streamToBuffer(res.response.body),
			options: data.options,
		}),
		processedImageServices.getSingleCount(serviceConfig, {
			key: data.key,
		}),
	]);

	if (imageRes.error || processedCountRes.error || !imageRes.data) {
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

	const stream = new PassThrough();
	stream.end(Buffer.from(imageRes.data.buffer));

	// Check if the processed image limit has been reached for this key, if so return processed image without saving
	if (processedCountRes.data >= serviceConfig.config.media.processed.limit) {
		return {
			error: undefined,
			data: {
				key: data.processKey,
				contentLength: imageRes.data.size,
				contentType: imageRes.data.mimeType,
				body: stream,
			},
		};
	}

	// Check if we can store it
	const canStoreRes = await processedImageServices.checks.checkCanStore(
		serviceConfig,
		{
			size: imageRes.data.size,
		},
	);
	if (canStoreRes.error) {
		return {
			error: undefined,
			data: {
				key: data.processKey,
				contentLength: imageRes.data.size,
				contentType: imageRes.data.mimeType,
				body: stream,
			},
		};
	}

	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	if (serviceConfig.config.media.processed.store === true) {
		Promise.all([
			ProcessedImagesRepo.createSingle({
				key: data.processKey,
				mediaKey: data.key,
				fileSize: imageRes.data.size,
			}),
			mediaStrategyRes.data.uploadSingle({
				key: data.processKey,
				data: imageRes.data.buffer,
				meta: {
					mimeType: imageRes.data.mimeType,
					fileExtension: imageRes.data.extension,
					size: imageRes.data.size,
					width: imageRes.data.width,
					height: imageRes.data.height,
					type: "image",
					key: data.processKey,
				},
			}),
			optionsServices.updateSingle(serviceConfig, {
				name: "media_storage_used",
				valueInt: canStoreRes.data.proposedSize,
			}),
		]);
	}

	return {
		error: undefined,
		data: {
			key: data.processKey,
			contentLength: imageRes.data.size,
			contentType: imageRes.data.mimeType,
			body: stream,
		},
	};
};

export default processImage;
