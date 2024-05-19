export interface TranslationsObj {
	localeCode: string;
	value: string | null;
}

export const removeDuplicates = (translations: TranslationsObj[]) =>
	translations.filter(
		(translation, index, self) =>
			index ===
			self.findIndex((t) => t.localeCode === translation.localeCode),
	);

export const mergeTranslationGroups = <K>(
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

export const getUniquelocaleCodes = (items: Array<TranslationsObj[]>) => {
	const localeCodes = items.flatMap((t) => t.map((t) => t.localeCode));
	return Array.from(new Set(localeCodes));
};

export const shouldUpdateTranslations = (
	item: Array<TranslationsObj[] | undefined>,
) => item.some((t) => t !== undefined && t.length > 0);
