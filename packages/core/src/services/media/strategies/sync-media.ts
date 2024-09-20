import T from "../../../translations/index.js";
import MediaKit from "../../../libs/media-kit/index.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../../utils/services/types.js";
import type { MediaKitMeta } from "../../../libs/media-kit/index.js";

//* TODO: fetch media meta, if image workout dimensions, average colour, blur hash etc

const syncMedia: ServiceFn<
	[
		{
			key: string;
			mimeType: string;
		},
	],
	// MediaKitMeta
	undefined
> = async (context, data) => {
	const mediaStrategyRes =
		context.services.media.checks.checkHasMediaStrategy(context);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	// const media = new MediaKit(context.config.media);

	const mediaMetaRes = await mediaStrategyRes.data.getMeta(data.key);
	if (mediaMetaRes.error) return mediaMetaRes;

	console.log(mediaMetaRes.data);

	return {
		error: undefined,
		data: undefined,
	};
};

export default syncMedia;
