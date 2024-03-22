import type { FastifyRequest } from "fastify";
import serviceWrapper from "../utils/app/service-wrapper.js";
import languagesServices from "../services/languages/index.js";

const contentLanguage = async (request: FastifyRequest) => {
	const contentLang = request.headers["headless-content-lang"];

	const language = await serviceWrapper(
		languagesServices.getSingleFallback,
		false,
	)(
		{
			db: request.server.db,
		},
		{
			id: contentLang !== undefined ? Number(contentLang) : undefined,
		},
	);

	request.language = language;
};

export default contentLanguage;
