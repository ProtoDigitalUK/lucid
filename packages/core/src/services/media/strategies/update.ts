import MediaKit, { type MediaKitMeta } from "../../../libs/media-kit/index.js";
import type { ServiceFn } from "../../../utils/services/types.js";

const update: ServiceFn<
	[
		{
			id: number;
			fileName: string;
			previousSize: number;
			previousKey: string;
			updatedKey: string;
		},
	],
	MediaKitMeta
> = async (context, data) => {
	const mediaStrategyRes =
		context.services.media.checks.checkHasMediaStrategy(context);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	// Fetch meta data from new file
	const mediaMetaRes = await mediaStrategyRes.data.getMeta(data.updatedKey);
	if (mediaMetaRes.error) return mediaMetaRes;

	// Ensure we available storage space
	const proposedSizeRes =
		await context.services.media.checks.checkCanUpdateMedia(context, {
			size: mediaMetaRes.data.size,
			previousSize: data.previousSize,
		});
	if (proposedSizeRes.error) return proposedSizeRes;

	const mediaKit = new MediaKit(context.config.media);

	const injectMediaRes = await mediaKit.injectFile({
		streamFile: () => mediaStrategyRes.data.stream(data.updatedKey),
		key: data.updatedKey,
		mimeType: mediaMetaRes.data.mimeType,
		fileName: data.fileName,
		size: mediaMetaRes.data.size,
		etag: mediaMetaRes.data.etag,
	});
	if (injectMediaRes.error) return injectMediaRes;

	// Delete old file
	const deleteOldRes = await mediaStrategyRes.data.deleteSingle(
		data.previousKey,
	);
	if (deleteOldRes.error) {
		return {
			error: {
				type: "basic",
				message: deleteOldRes.error.message,
				status: 500,
				errorResponse: {
					body: {
						file: {
							code: "media_error",
							message: deleteOldRes.error.message,
						},
					},
				},
			},
			data: undefined,
		};
	}

	// update storage, processed images and delete temp
	const [storageRes, clearProcessRes] = await Promise.all([
		context.services.option.updateSingle(context, {
			name: "media_storage_used",
			valueInt: proposedSizeRes.data.proposedSize,
		}),
		context.services.processedImage.clearSingle(context, {
			id: data.id,
		}),
	]);
	if (storageRes.error) return storageRes;
	if (clearProcessRes.error) return clearProcessRes;

	return {
		error: undefined,
		data: injectMediaRes.data,
	};
};

export default update;
