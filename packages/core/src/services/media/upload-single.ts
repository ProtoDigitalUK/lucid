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
	const localeExistsRes =
		await context.services.locale.checks.checkLocalesExist(context, {
			localeCodes: getUniqueLocaleCodes([
				data.titleTranslations || [],
				data.altTranslations || [],
			]),
		});
	if (localeExistsRes.error) return localeExistsRes;

	const translationKeyIdsRes =
		await context.services.translation.createMultiple(context, {
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
		});
	if (translationKeyIdsRes.error) return translationKeyIdsRes;

	const uploadRes = await context.services.media.strategies.upload(context, {
		fileData: data.fileData,
	});
	if (uploadRes.error) return uploadRes;

	const MediaRepo = Repository.get("media", context.db);
	const mediaRes = await MediaRepo.createSingle({
		key: uploadRes.data.key,
		eTag: uploadRes.data.etag ?? undefined,
		visible: data.visible ?? 1,
		type: uploadRes.data.type,
		mimeType: uploadRes.data.mimeType,
		extension: uploadRes.data.extension,
		fileSize: uploadRes.data.size,
		width: uploadRes.data.width,
		height: uploadRes.data.height,
		titleTranslationKeyId: translationKeyIdsRes.data.title,
		altTranslationKeyId: translationKeyIdsRes.data.alt,
		blurHash: uploadRes.data.blurHash,
	});

	if (mediaRes === undefined) {
		await context.config.media?.strategy?.deleteSingle(uploadRes.data.key);
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
};

export default uploadSingle;
