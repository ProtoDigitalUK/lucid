import type { ServiceFn } from "../../utils/services/types.js";

const getSingleFallback: ServiceFn<
	[
		{
			code?: string;
		},
	],
	{
		code: string;
	}
> = async (service, data) => {
	const configLocale = service.config.localisation.locales.find(
		(locale) => locale.code === data.code,
	);

	if (configLocale === undefined && !data.code) {
		return {
			error: undefined,
			data: {
				code: service.config.localisation.defaultLocale,
			},
		};
	}

	return {
		error: undefined,
		data: {
			code: data.code || service.config.localisation.defaultLocale,
		},
	};
};

export default getSingleFallback;
