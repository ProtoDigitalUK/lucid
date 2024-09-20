import {
	mergeTranslationGroups,
	getUniqueLocaleCodes,
} from "../../utils/translations/index.js";
import Repository from "../../libs/repositories/index.js";
import type { BooleanInt } from "../../libs/db/types.js";
import type { ServiceFn } from "../../utils/services/types.js";

const createSingle: ServiceFn<
	[
		{
			key: string;
			mimeType: string;
			title?: {
				localeCode: string;
				value: string | null;
			}[];
			alt?: {
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
				data.title || [],
				data.alt || [],
			]),
		});
	if (localeExistsRes.error) return localeExistsRes;

	const translationKeyIdsRes =
		await context.services.translation.createMultiple(context, {
			keys: ["title", "alt"],
			translations: mergeTranslationGroups([
				{
					translations: data.title || [],
					key: "title",
				},
				{
					translations: data.alt || [],
					key: "alt",
				},
			]),
		});
	if (translationKeyIdsRes.error) return translationKeyIdsRes;

	const syncMediaRes = await context.services.media.strategies.syncMedia(
		context,
		{
			key: data.key,
			mimeType: data.mimeType,
		},
	);
	if (syncMediaRes.error) return syncMediaRes;

	console.log(syncMediaRes);

	// const MediaRepo = Repository.get("media", context.db);
	// const mediaRes = await MediaRepo.createSingle({
	// 	key: uploadRes.data.key,
	// 	eTag: uploadRes.data.etag ?? undefined,
	// 	visible: data.visible ?? 1,
	// 	type: uploadRes.data.type,
	// 	mimeType: uploadRes.data.mimeType,
	// 	extension: uploadRes.data.extension,
	// 	fileSize: uploadRes.data.size,
	// 	width: uploadRes.data.width,
	// 	height: uploadRes.data.height,
	// 	titleTranslationKeyId: translationKeyIdsRes.data.title,
	// 	altTranslationKeyId: translationKeyIdsRes.data.alt,
	// 	blurHash: uploadRes.data.blurHash,
	// 	averageColour: uploadRes.data.averageColour,
	// 	isDark: uploadRes.data.isDark,
	// 	isLight: uploadRes.data.isLight,
	// });

	// if (mediaRes === undefined) {
	// 	await context.config.media?.strategy?.deleteSingle(uploadRes.data.key);
	// 	return {
	// 		error: {
	// 			type: "basic",
	// 			status: 500,
	// 		},
	// 		data: undefined,
	// 	};
	// }

	return {
		error: undefined,
		data: 1,
	};
};

export default createSingle;
