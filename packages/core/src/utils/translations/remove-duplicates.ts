import type { TranslationsObj } from "../../types/shared.js";

const removeDuplicates = (translations: TranslationsObj[]) =>
	translations.filter(
		(translation, index, self) =>
			index ===
			self.findIndex((t) => t.localeCode === translation.localeCode),
	);

export default removeDuplicates;
