const objectifyTranslations = (
	values: Array<{
		locale_code: string | null;
		value: string | null;
	}>,
	locales: string[],
): Record<string, string> => {
	return locales.reduce<Record<string, string>>((acc, locale) => {
		const value = values.find((v) => v.locale_code === locale);
		if (!value) {
			acc[locale] = "";
		} else {
			acc[locale] = value.value ?? "";
		}
		return acc;
	}, {});
};

export default objectifyTranslations;
