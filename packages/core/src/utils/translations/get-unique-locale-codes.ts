import type { TranslationsObj } from "../../types/shared.js";

const getUniqueLocaleCodes = (items: Array<TranslationsObj[]>) => {
	const localeCodes = items.flatMap((t) => t.map((t) => t.localeCode));
	return Array.from(new Set(localeCodes));
};

export default getUniqueLocaleCodes;
