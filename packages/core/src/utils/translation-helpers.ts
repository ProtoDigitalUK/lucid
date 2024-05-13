export interface TranslationsObj {
	languageCode: string;
	value: string | null;
}

export const removeDuplicates = (translations: TranslationsObj[]) =>
	translations.filter(
		(translation, index, self) =>
			index ===
			self.findIndex((t) => t.languageCode === translation.languageCode),
	);

export const mergeTranslationGroups = <K>(
	items: Array<{
		translations: TranslationsObj[];
		key: K;
	}>,
) => {
	const translations: {
		languageCode: string;
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

export const getUniqueLanguageCodes = (items: Array<TranslationsObj[]>) => {
	const languageCodes = items.flatMap((t) => t.map((t) => t.languageCode));
	return Array.from(new Set(languageCodes));
};

export const shouldUpdateTranslations = (
	item: Array<TranslationsObj[] | undefined>,
) => item.some((t) => t !== undefined && t.length > 0);
