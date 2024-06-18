import lucidServices from "../services/index.js";
import serviceWrapper from "../libs/services/service-wrapper.js";
import { LucidAPIError } from "../utils/error-handler.js";
import type { FastifyRequest } from "fastify";

const contentLocale = async (request: FastifyRequest) => {
	const contentLocale = request.headers["lucid-content-locale"];

	const localeRes = await serviceWrapper(
		lucidServices.locale.getSingleFallback,
		{
			transaction: false,
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			code: Array.isArray(contentLocale)
				? contentLocale[0]
				: contentLocale,
		},
	);
	if (localeRes.error) throw new LucidAPIError(localeRes.error);

	request.locale = localeRes.data;

	return;
};

export default contentLocale;
