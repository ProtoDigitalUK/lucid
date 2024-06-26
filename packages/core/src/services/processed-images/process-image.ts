import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import { streamToBuffer } from "../../utils/media/index.js";
import { PassThrough, type Readable } from "node:stream";
import type z from "zod";
import type cdnSchema from "../../schemas/cdn.js";
import type { ServiceFn } from "../../utils/services/types.js";

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
> = async (context, data) => {
	const mediaStrategyRes =
		await context.services.media.checks.checkHasMediaStrategy(context);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	// get og image
	const res = await mediaStrategyRes.data.stream(data.key);

	// If there is no response
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
		context.services.processedImage.optimiseImage(context, {
			buffer: await streamToBuffer(res.response.body),
			options: data.options,
		}),
		context.services.processedImage.getSingleCount(context, {
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
	if (processedCountRes.data >= context.config.media.processed.limit) {
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
	const canStoreRes =
		await context.services.processedImage.checks.checkCanStore(context, {
			size: imageRes.data.size,
		});
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

	const ProcessedImagesRepo = Repository.get("processed-images", context.db);

	if (context.config.media.processed.store === true) {
		await Promise.all([
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
			context.services.option.updateSingle(context, {
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
