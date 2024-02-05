import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import permissions from "../../../controllers/permissions/index.js";

const permissionRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
		},
		swaggerSchema: permissions.getAll.swaggerSchema,
		zodSchema: permissions.getAll.zodSchema,
		controller: permissions.getAll.controller,
	});
};

export default permissionRoutes;
