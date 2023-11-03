import { createSignal } from "solid-js";
// Types
import { LanguageResT } from "@lucid/types/src/language";

// -------------------------------
// Functions
const setContentLanguage = (value: number | undefined) => {
  setContentLanguageValue(value);

  if (!value) {
    localStorage.removeItem("lucid_content_language");
    return;
  } else {
    localStorage.setItem("lucid_content_language", value.toString());
  }
};
const getInitialContentLanguage = () => {
  const contentLang = localStorage.getItem("lucid_content_language");
  if (contentLang) {
    return Number(contentLang);
  }
  return undefined;
};
const syncContentLanguage = (languages: LanguageResT[]) => {
  if (languages.length === 0) {
    setContentLanguage(undefined);
    return;
  }

  const contentLangLs = localStorage.getItem("lucid_content_language");
  if (contentLangLs) {
    // check if environment exists
    const languageExists = languages.find(
      (lang) => lang.id === Number(contentLangLs)
    );
    if (languageExists !== undefined) {
      setContentLanguage(Number(contentLangLs));
      return;
    }
  }
  setContentLanguage(languages[0]?.id || undefined);
};

// -------------------------------
// State
const [contentLanguage, setContentLanguageValue] = createSignal<
  number | undefined
>(getInitialContentLanguage());

export { contentLanguage, setContentLanguage, syncContentLanguage };
