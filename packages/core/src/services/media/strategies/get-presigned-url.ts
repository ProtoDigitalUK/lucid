import type { ServiceFn } from "../../../utils/services/types.js";

const getPresignedUrl: ServiceFn<
	[
		{
			key: string;
			mimeType: string;
			extension?: string;
		},
	],
	{
		url: string;
	}
> = async (context, data) => {
	const mediaStrategyRes =
		context.services.media.checks.checkHasMediaStrategy(context);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const presignedUrlRes = await mediaStrategyRes.data.getPresignedUrl(
		data.key,
		{
			host: context.config.host,
			mimeType: data.mimeType,
			extension: data.extension,
		},
	);

	if (presignedUrlRes.error) {
		return {
			error: {
				type: "basic",
				message: presignedUrlRes.error.message,
				status: 500,
				errorResponse: {
					body: {
						file: {
							code: "media_error",
							message: presignedUrlRes.error.message,
						},
					},
				},
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: presignedUrlRes.data,
	};
};

export default getPresignedUrl;
