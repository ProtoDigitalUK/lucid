import type { FastifyRequest } from "fastify";
import serviceWrapper from "../utils/service-wrapper.js";
import languagesServices from "../services/languages/index.js";

const contentLanguage = async (request: FastifyRequest) => {
	const contentLang = request.headers["lucid-content-lang"];

	const language = await serviceWrapper(
		languagesServices.getSingleFallback,
		false,
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			code: Array.isArray(contentLang) ? contentLang[0] : contentLang,
		},
	);

	request.language = language;
};

export default contentLanguage;
