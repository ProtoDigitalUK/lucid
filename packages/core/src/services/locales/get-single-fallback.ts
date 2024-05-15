import type { Config } from "../../types.js";

export interface ServiceData {
	code?: string;
}

const getSingleFallback = (config: Config, data: ServiceData) => {
	const configLocale = config.localisation.locales.find(
		(locale) => locale.code === data.code,
	);

	if (configLocale === undefined && !data.code) {
		return {
			code: config.localisation.defaultLocale,
		};
	}

	return {
		code: data.code || config.localisation.defaultLocale,
	};
};

export default getSingleFallback;
