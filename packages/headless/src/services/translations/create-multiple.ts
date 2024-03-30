import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData<K extends string> {
	keys: K[];
	translations: Array<{
		value: string | null;
		language_id: number;
		key: K;
	}>;
}

const createMultiple = async <K extends string>(
	serviceConfig: ServiceConfigT,
	data: ServiceData<K>,
) => {
	if (data.keys.length === 0) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("translation"),
			}),
			message: T("error_not_created_message", {
				name: T("translation"),
			}),
			status: 400,
		});
	}

	const TranslationKeysRepo = RepositoryFactory.getRepository(
		"translation-keys",
		serviceConfig.config,
	);

	const translationKeyEntries = await TranslationKeysRepo.createMultiple(
		data.keys.map((k) => ({ createdAt: new Date().toISOString() })),
	);

	if (translationKeyEntries.length !== data.keys.length) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("translation"),
			}),
			message: T("error_not_created_message", {
				name: T("translation"),
			}),
			status: 400,
		});
	}

	const keys: Record<K, number> = data.keys.reduce(
		(keys, key, index) => {
			keys[key] = translationKeyEntries[index].id;
			return keys;
		},
		{} as Record<K, number>,
	);

	if (data.translations.length === 0) {
		return keys;
	}

	await serviceConfig.db
		.insertInto("headless_translations")
		.values(
			data.translations.map((translation) => {
				return {
					translation_key_id: keys[translation.key],
					language_id: translation.language_id,
					value: translation.value,
				};
			}),
		)
		.execute();

	return keys;
};

export default createMultiple;
