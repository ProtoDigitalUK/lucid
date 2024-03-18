import { createStore } from "solid-js/store";
// Types
import { LanguageResT } from "@headless/types/src/language";

type ContentLangStoreT = {
	contentLanguage: number | undefined;
	languages: LanguageResT[];
	syncContentLanguage: (_languages: LanguageResT[]) => void;
	setContentLanguage: (_contentLanguage?: number) => void;
};

const getInitialContentLanguage = () => {
	const contentLang = localStorage.getItem("headless_content_language");
	if (contentLang) {
		return Number(contentLang);
	}
	return undefined;
};

const [get, set] = createStore<ContentLangStoreT>({
	contentLanguage: getInitialContentLanguage(),
	languages: [],

	syncContentLanguage(languages: LanguageResT[]) {
		if (languages.length === 0) {
			set("contentLanguage", undefined);
			return;
		}

		const contentLangLs = localStorage.getItem("headless_content_language");
		if (contentLangLs) {
			// check if environment exists
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
			localStorage.removeItem("headless_content_language");
		else
			localStorage.setItem(
				"headless_content_language",
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
