import type { FastifyRequest } from "fastify";
import localesServices from "../services/locales/index.js";

const contentLocale = async (request: FastifyRequest) => {
	const contentLocale = request.headers["lucid-content-locale"];

	request.locale = localesServices.getSingleFallback(request.server.config, {
		code: Array.isArray(contentLocale) ? contentLocale[0] : contentLocale,
	});

	return;
};

export default contentLocale;
