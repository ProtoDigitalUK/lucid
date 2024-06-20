export type SupportedLocales = "en";
export type LocaleValue = Record<SupportedLocales, string> | string;

export interface TranslationsObj {
	localeCode: string;
	value: string | null;
}
