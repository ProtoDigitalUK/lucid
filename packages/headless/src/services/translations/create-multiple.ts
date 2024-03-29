import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";

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

	const translationKeyEntries = await serviceConfig.db
		.insertInto("headless_translation_keys")
		.values(
			data.keys.map((key) => ({ created_at: new Date().toISOString() })),
		)
		.returning("id")
		.execute();

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
