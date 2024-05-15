import { createStore } from "solid-js/store";
import type { LanguageResponse } from "@lucidcms/core/types";

type ContentLangStoreT = {
	contentLocale: string | undefined;
	languages: LanguageResponse[];
	synccontentLocale: (_languages: LanguageResponse[]) => void;
	setcontentLocale: (_contentLocale?: string) => void;
};

const getInitialcontentLocale = () => {
	const contentLang = localStorage.getItem("lucid_content_language");
	if (contentLang) {
		return contentLang;
	}
	return undefined;
};

const [get, set] = createStore<ContentLangStoreT>({
	contentLocale: getInitialcontentLocale(),
	languages: [],

	synccontentLocale(languages: LanguageResponse[]) {
		if (languages.length === 0) {
			set("contentLocale", undefined);
			return;
		}

		const contentLangLs = localStorage.getItem("lucid_content_language");
		if (contentLangLs) {
			const languageExists = languages.find(
				(lang) => lang.code === contentLangLs,
			);
			if (languageExists !== undefined) {
				set("contentLocale", contentLangLs);
				return;
			}
		}
		set("contentLocale", languages[0]?.code || undefined);
	},
	setcontentLocale(contentLocale?: string) {
		if (contentLocale === undefined)
			localStorage.removeItem("lucid_content_language");
		else
			localStorage.setItem(
				"lucid_content_language",
				String(contentLocale),
			);
		set("contentLocale", contentLocale);
	},
});

const contentLocaleStore = {
	get,
	set,
};

export default contentLocaleStore;
