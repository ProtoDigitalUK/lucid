import T from "../../translations/index.js";
import MediaKit from "../../libs/media-kit/index.js";
import mime from "mime-types";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const getPresignedUrl: ServiceFn<
	[
		{
			fileName: string;
			mimeType: string;
		},
	],
	{
		url: string;
		key: string;
	}
> = async (context, data) => {
	const MediaRepo = Repository.get("media", context.db);

	const extension = mime.extension(data.mimeType);

	const keyRes = MediaKit.generateKey({
		name: data.fileName,
		extension: extension || null,
	});
	if (keyRes.error) return keyRes;

	const duplicateKeyRes = await MediaRepo.selectSingle({
		select: ["key"],
		where: [
			{
				key: "key",
				operator: "=",
				value: keyRes.data,
			},
		],
	});
	if (duplicateKeyRes !== undefined) {
		return {
			error: {
				type: "basic",
				name: T("media_duplicate_key_error_name"),
				message: T("media_duplicate_key_error_message"),
				status: 400,
			},
			data: undefined,
		};
	}

	const getPresignedUrlRes =
		await context.services.media.strategies.getPresignedUrl(context, {
			key: keyRes.data,
			mimeType: data.mimeType,
			extension: extension || undefined,
		});
	if (getPresignedUrlRes.error) return getPresignedUrlRes;

	return {
		error: undefined,
		data: {
			url: getPresignedUrlRes.data.url,
			key: keyRes.data,
		},
	};
};

export default getPresignedUrl;
