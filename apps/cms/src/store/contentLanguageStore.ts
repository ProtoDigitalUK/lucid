import { createStore } from "solid-js/store";
// Types
import type { LanguageResponse } from "@lucidcms/core/types";

type ContentLangStoreT = {
	contentLanguage: number | undefined;
	languages: LanguageResponse[];
	syncContentLanguage: (_languages: LanguageResponse[]) => void;
	setContentLanguage: (_contentLanguage?: number) => void;
};

const getInitialContentLanguage = () => {
	const contentLang = localStorage.getItem("lucid_content_language");
	if (contentLang) {
		return Number(contentLang);
	}
	return undefined;
};

const [get, set] = createStore<ContentLangStoreT>({
	contentLanguage: getInitialContentLanguage(),
	languages: [],

	syncContentLanguage(languages: LanguageResponse[]) {
		if (languages.length === 0) {
			set("contentLanguage", undefined);
			return;
		}

		const contentLangLs = localStorage.getItem("lucid_content_language");
		if (contentLangLs) {
			const languageExists = languages.find(
				(lang) => lang.id === Number(contentLangLs),
			);
			if (languageExists !== undefined) {
				set("contentLanguage", Number(contentLangLs));
				return;
			}
		}
		set("contentLanguage", languages[0]?.id || undefined);
	},
	setContentLanguage(contentLanguage?: number) {
		if (contentLanguage === undefined)
			localStorage.removeItem("lucid_content_language");
		else
			localStorage.setItem(
				"lucid_content_language",
				String(contentLanguage),
			);
		set("contentLanguage", contentLanguage);
	},
});

const contentLanguageStore = {
	get,
	set,
};

export default contentLanguageStore;
