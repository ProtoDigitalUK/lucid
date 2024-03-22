import serviceWrapper from "../../utils/service-wrapper.js";
import languagesServices from "../languages/index.js";
import {
	shouldUpdateTranslations,
	mergeTranslationGroups,
	getUniqueLanguageIDs,
	type TranslationsObjT,
} from "../../utils/translation-helpers.js";

export interface ServiceData<K extends string> {
	keys: Record<K, number | null>;
	items: Array<{
		translations: TranslationsObjT[];
		key: K;
	}>;
}

const upsertMultiple = async <K extends string>(
	serviceConfig: ServiceConfigT,
	data: ServiceData<K>,
) => {
	if (shouldUpdateTranslations(data.items.map((item) => item.translations))) {
		await serviceWrapper(
			languagesServices.checks.checkLanguagesExist,
			false,
		)(serviceConfig, {
			language_ids: getUniqueLanguageIDs(
				data.items.map((item) => item.translations || []),
			),
		});

		const translations = mergeTranslationGroups<K>(data.items)
			.map((translation) => {
				return {
					value: translation.value ?? "",
					language_id: translation.language_id,
					translation_key_id: data.keys[translation.key] ?? null,
				};
			})
			.filter(
				(translation) => translation.translation_key_id !== null,
			) as Array<{
			value: string;
			language_id: number;
			translation_key_id: number;
		}>;

		if (translations.length === 0) {
			return;
		}

		await serviceConfig.db
			.insertInto("headless_translations")
			.values(translations)
			.onConflict((oc) =>
				oc
					.columns(["translation_key_id", "language_id"])
					.doUpdateSet((eb) => ({
						value: eb.ref("excluded.value"),
					})),
			)
			.execute();
	}
};

export default upsertMultiple;
