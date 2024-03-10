import type { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import multiplePage from "../../../controllers/multiple-page/index.js";

const multiplePageRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: multiplePage.createSingle.swaggerSchema,
		zodSchema: multiplePage.createSingle.zodSchema,
		controller: multiplePage.createSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: multiplePage.getSingle.swaggerSchema,
		zodSchema: multiplePage.getSingle.zodSchema,
		controller: multiplePage.getSingle.controller,
	});

	r(fastify, {
		method: "patch",
		url: "/:id",
		permissions: ["update_content"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: multiplePage.updateSingle.swaggerSchema,
		zodSchema: multiplePage.updateSingle.zodSchema,
		controller: multiplePage.updateSingle.controller,
	});
};

export default multiplePageRoutes;
