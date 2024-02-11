import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import langauges from "../../../controllers/languages/index.js";

const langaugeRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: {
			global: ["create_language"],
		},
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: langauges.createSingle.swaggerSchema,
		zodSchema: langauges.createSingle.zodSchema,
		controller: langauges.createSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:code",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: langauges.getSingle.swaggerSchema,
		zodSchema: langauges.getSingle.zodSchema,
		controller: langauges.getSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: langauges.getMultiple.swaggerSchema,
		zodSchema: langauges.getMultiple.zodSchema,
		controller: langauges.getMultiple.controller,
	});
};

export default langaugeRoutes;
