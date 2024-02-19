import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import settings from "../../../controllers/settings/index.js";

const settingsRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: settings.getSettings.swaggerSchema,
		zodSchema: settings.getSettings.zodSchema,
		controller: settings.getSettings.controller,
	});
};

export default settingsRoutes;
