import serviceWrapper from "../../utils/service-wrapper.js";
import languagesServices from "../languages/index.js";
import {
	shouldUpdateTranslations,
	mergeTranslationGroups,
	getUniqueLanguageIDs,
	type TranslationsObjT,
} from "../../utils/translation-helpers.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

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
					languageId: translation.language_id,
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

		const TranslationsRepo = RepositoryFactory.getRepository(
			"translations",
			serviceConfig.config,
		);

		await TranslationsRepo.upsertMultiple(translations);
	}
};

export default upsertMultiple;
