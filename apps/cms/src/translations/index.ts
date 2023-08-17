// Translation files
import enGb from "./en-gb.json";

const T = (key: string, data?: Record<string, string | number>) => {
  const selectedLang = enGb;

  const translation = selectedLang[key as keyof typeof selectedLang];
  if (!translation) {
    return key;
  }
  if (!data) {
    return translation;
  }

  return translation.replace(
    /\{\{(\w+)\}\}/g,
    (match, p1) => data[p1 as keyof typeof data] as string
  );
};

export default T;
