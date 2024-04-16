import serviceWrapper from "../../utils/service-wrapper.js";
import languagesServices from "../languages/index.js";
import {
	shouldUpdateTranslations,
	mergeTranslationGroups,
	getUniqueLanguageIDs,
	type TranslationsObj,
} from "../../utils/translation-helpers.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData<K extends string> {
	keys: Record<K, number | null>;
	items: Array<{
		translations: TranslationsObj[];
		key: K;
	}>;
}

const upsertMultiple = async <K extends string>(
	serviceConfig: ServiceConfig,
	data: ServiceData<K>,
) => {
	if (shouldUpdateTranslations(data.items.map((item) => item.translations))) {
		await serviceWrapper(
			languagesServices.checks.checkLanguagesExist,
			false,
		)(serviceConfig, {
			languageIds: getUniqueLanguageIDs(
				data.items.map((item) => item.translations || []),
			),
		});

		const translations = mergeTranslationGroups<K>(data.items)
			.map((translation) => {
				return {
					value: translation.value ?? "",
					languageId: translation.languageId,
					translationKeyId: data.keys[translation.key] ?? null,
				};
			})
			.filter(
				(translation) => translation.translationKeyId !== null,
			) as Array<{
			value: string;
			languageId: number;
			translationKeyId: number;
		}>;

		if (translations.length === 0) {
			return;
		}

		const TranslationsRepo = Repository.get(
			"translations",
			serviceConfig.db,
		);

		await TranslationsRepo.upsertMultiple(translations);
	}
};

export default upsertMultiple;
