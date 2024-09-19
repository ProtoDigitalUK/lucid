import T from "../../translations/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const getPresignedUrl: ServiceFn<
	[
		{
			fileName: string;
			mimeType: string;
			width?: number;
			height?: number;
		},
	],
	{
		url: string;
	}
> = async (context, data) => {
	const key = `${data.fileName}.example`;

	const getPresignedUrlRes =
		await context.services.media.strategies.getPresignedUrl(context, {
			key: key,
			mimeType: data.mimeType,
			width: data.width,
			height: data.height,
			extension: ".png",
		});
	if (getPresignedUrlRes.error) return getPresignedUrlRes;

	return {
		error: undefined,
		data: getPresignedUrlRes.data,
	};
};

export default getPresignedUrl;
