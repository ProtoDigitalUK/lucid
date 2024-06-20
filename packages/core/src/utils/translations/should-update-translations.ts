import type { TranslationsObj } from "../../types/shared.js";

const shouldUpdateTranslations = (item: Array<TranslationsObj[] | undefined>) =>
	item.some((t) => t !== undefined && t.length > 0);

export default shouldUpdateTranslations;
