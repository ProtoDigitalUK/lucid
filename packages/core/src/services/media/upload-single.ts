import {
	mergeTranslationGroups,
	getUniqueLocaleCodes,
} from "../../utils/translations/index.js";
import Repository from "../../libs/repositories/index.js";
import type { BooleanInt } from "../../libs/db/types.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../utils/services/types.js";

const uploadSingle: ServiceFn<
	[
		{
			fileData: MultipartFile | undefined;
			titleTranslations?: {
				localeCode: string;
				value: string | null;
			}[];
			altTranslations?: {
				localeCode: string;
				value: string | null;
			}[];
			visible?: BooleanInt;
		},
	],
	number
> = async (context, data) => {
	let objectStored = false;
	let objectKey = undefined;

	try {
		const MediaRepo = Repository.get("media", context.db);

		const localeExistsRes =
			await context.services.locale.checks.checkLocalesExist(context, {
				localeCodes: getUniqueLocaleCodes([
					data.titleTranslations || [],
					data.altTranslations || [],
				]),
			});
		if (localeExistsRes.error) return localeExistsRes;

		const [translationKeyIdsRes, uploadObjectRes] = await Promise.all([
			context.services.translation.createMultiple(context, {
				keys: ["title", "alt"],
				translations: mergeTranslationGroups([
					{
						translations: data.titleTranslations || [],
						key: "title",
					},
					{
						translations: data.altTranslations || [],
						key: "alt",
					},
				]),
			}),
			context.services.media.storage.uploadObject(context, {
				fileData: data.fileData,
			}),
		]);
		if (translationKeyIdsRes.error) return translationKeyIdsRes;
		if (uploadObjectRes.error) return uploadObjectRes;

		objectStored = true;
		objectKey = uploadObjectRes.data.key;

		const mediaRes = await MediaRepo.createSingle({
			key: uploadObjectRes.data.key,
			eTag: uploadObjectRes.data.etag,
			visible: data.visible ?? 1,
			type: uploadObjectRes.data.type,
			mimeType: uploadObjectRes.data.mimeType,
			fileExtension: uploadObjectRes.data.fileExtension,
			fileSize: uploadObjectRes.data.size,
			width: uploadObjectRes.data.width,
			height: uploadObjectRes.data.height,
			titleTranslationKeyId: translationKeyIdsRes.data.title,
			altTranslationKeyId: translationKeyIdsRes.data.alt,
			blurHash: uploadObjectRes.data.blurHash,
		});

		if (mediaRes === undefined) {
			return {
				error: {
					type: "basic",
					status: 500,
				},
				data: undefined,
			};
		}

		return {
			error: undefined,
			data: mediaRes.id,
		};
	} catch (e) {
		if (objectStored && objectKey !== undefined) {
			context.config.media?.strategy?.deleteSingle(objectKey);
		}

		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}
};

export default uploadSingle;
