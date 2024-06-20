import { removeDuplicates } from "./index.js";
import type { TranslationsObj } from "../../types/shared.js";

const mergeTranslationGroups = <K>(
	items: Array<{
		translations: TranslationsObj[];
		key: K;
	}>,
) => {
	const translations: {
		localeCode: string;
		value: string | null;
		key: K;
	}[] = [];
	for (const item of items) {
		const itemTranslations = removeDuplicates(item.translations);
		for (const translation of itemTranslations) {
			translations.push({
				...translation,
				key: item.key,
			});
		}
	}
	return translations;
};

export default mergeTranslationGroups;
