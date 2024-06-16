import localesServices from "../locales/index.js";
import {
	shouldUpdateTranslations,
	mergeTranslationGroups,
	type TranslationsObj,
	getUniquelocaleCodes,
} from "../../utils/translation-helpers.js";
import Repository from "../../libs/repositories/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import type { ServiceConfig, ServiceFn } from "../../libs/services/types.js";

export interface ServiceData<K extends string> {
	keys: Record<K, number | null>;
	items: Array<{
		translations: TranslationsObj[];
		key: K;
	}>;
}

const upsertMultiple: ServiceFn<[ServiceData<string>], undefined> = async <
	K extends string,
>(
	serviceConfig: ServiceConfig,
	data: ServiceData<K>,
) => {
	if (shouldUpdateTranslations(data.items.map((item) => item.translations))) {
		const localeExistsRes = await serviceWrapper(
			localesServices.checks.checkLocalesExist,
			{
				transaction: false,
			},
		)(serviceConfig, {
			localeCodes: getUniquelocaleCodes(
				data.items.map((item) => item.translations || []),
			),
		});
		if (localeExistsRes.error) return localeExistsRes;

		const translations = mergeTranslationGroups<K>(data.items)
			.map((translation) => {
				return {
					value: translation.value ?? "",
					localeCode: translation.localeCode,
					translationKeyId: data.keys[translation.key] ?? null,
				};
			})
			// TODO: remove as when Typescript 5.5 is released
			.filter(
				(translation) => translation.translationKeyId !== null,
			) as Array<{
			value: string;
			localeCode: string;
			translationKeyId: number;
		}>;

		if (translations.length === 0) {
			return {
				error: undefined,
				data: undefined,
			};
		}

		const TranslationsRepo = Repository.get(
			"translations",
			serviceConfig.db,
		);

		await TranslationsRepo.upsertMultiple(translations);

		return {
			error: undefined,
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default upsertMultiple;
