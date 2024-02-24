interface TranslationsGroupT<K> {
	key: K;
	translations: Array<{
		value: string | null;
		language_id: number | null;
	}>;
}

const formatTranslations = <K extends string>(
	groups: TranslationsGroupT<K>[],
) => {
	const translations: Array<{
		language_id: number;
		value: string;
		key: K;
	}> = [];

	for (const group of groups) {
		for (const translation of group.translations) {
			if (
				translation.language_id === null ||
				translation.value === null
			) {
				continue;
			}
			translations.push({
				language_id: translation.language_id,
				value: translation.value,
				key: group.key,
			});
		}
	}

	return translations;
};

export const swaggerTranslationsRes = {
	type: "array",
	items: {
		type: "object",
		properties: {
			language_id: { type: "number", example: 1 },
			value: { type: "string", example: "hello" },
			key: { type: "string", example: "title" },
		},
	},
};

export default formatTranslations;
