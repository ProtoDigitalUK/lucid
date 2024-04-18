import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData<K extends string> {
	keys: K[];
	translations: Array<{
		value: string | null;
		languageId: number;
		key: K;
	}>;
}

const createMultiple = async <K extends string>(
	serviceConfig: ServiceConfig,
	data: ServiceData<K>,
) => {
	if (data.keys.length === 0) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 400,
		});
	}

	const TranslationKeysRepo = Repository.get(
		"translation-keys",
		serviceConfig.db,
	);

	const translationKeyEntries = await TranslationKeysRepo.createMultiple(
		data.keys.map((k) => ({ createdAt: new Date().toISOString() })),
	);

	if (translationKeyEntries.length !== data.keys.length) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 400,
		});
	}

	const keys: Record<K, number> = data.keys.reduce(
		(keys, key, index) => {
			const translationKeyId = translationKeyEntries[index]?.id;
			if (translationKeyId === undefined) {
				return keys;
			}
			keys[key] = translationKeyId;
			return keys;
		},
		{} as Record<K, number>,
	);

	if (data.translations.length === 0) {
		return keys;
	}

	const TranslationsRepo = Repository.get("translations", serviceConfig.db);

	await TranslationsRepo.upsertMultiple(
		data.translations.map((translation) => {
			return {
				translationKeyId: keys[translation.key],
				languageId: translation.languageId,
				value: translation.value,
			};
		}),
	);

	return keys;
};

export default createMultiple;