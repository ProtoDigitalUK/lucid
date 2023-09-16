// Translation files
import enGb from "./en-gb.json";

const selectedLang = enGb;

interface TranslationDataT {
  value: string | number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

type TranslationData = Record<string, TranslationDataT | string | number>;

const T = (key: keyof typeof selectedLang, data?: TranslationData) => {
  const translation = selectedLang[key as keyof typeof selectedLang];
  if (!translation) {
    return key;
  }
  if (!data) {
    return translation;
  }

  return translation.replace(/\{\{(\w+)\}\}/g, (match, p1) => {
    const value = data[p1 as keyof typeof data];
    if (typeof value === "object") {
      let valueToUse = String(value.value);
      if (value.toLowerCase) {
        valueToUse = valueToUse.toLowerCase();
      }
      if (value.toUpperCase) {
        valueToUse = valueToUse.toUpperCase();
      }
      return valueToUse;
    }

    return String(value);
  });
};

export default T;
