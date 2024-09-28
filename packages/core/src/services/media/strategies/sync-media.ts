import MediaKit from "../../../libs/media-kit/index.js";
import type { ServiceFn } from "../../../utils/services/types.js";
import type { MediaKitMeta } from "../../../libs/media-kit/index.js";

const syncMedia: ServiceFn<
	[
		{
			key: string;
			fileName: string;
		},
	],
	MediaKitMeta
> = async (context, data) => {
	const mediaStrategyRes =
		context.services.media.checks.checkHasMediaStrategy(context);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const mediaMetaRes = await mediaStrategyRes.data.getMeta(data.key);
	if (mediaMetaRes.error) return mediaMetaRes;

	const proposedSizeRes =
		await context.services.media.checks.checkCanStoreMedia(context, {
			size: mediaMetaRes.data.size,
			onError: async () => {
				await mediaStrategyRes.data.deleteSingle(data.key);
			},
		});
	if (proposedSizeRes.error) return proposedSizeRes;

	const mediaKit = new MediaKit(context.config.media);

	const injectMediaRes = await mediaKit.injectFile({
		streamFile: () => mediaStrategyRes.data.stream(data.key),
		key: data.key,
		mimeType: mediaMetaRes.data.mimeType,
		fileName: data.fileName,
		size: mediaMetaRes.data.size,
		etag: mediaMetaRes.data.etag,
	});
	if (injectMediaRes.error) return injectMediaRes;

	const updateStorageRes = await context.services.option.updateSingle(context, {
		name: "media_storage_used",
		valueInt: proposedSizeRes.data.proposedSize,
	});
	if (updateStorageRes.error) return updateStorageRes;

	return {
		error: undefined,
		data: injectMediaRes.data,
	};
};

export default syncMedia;
