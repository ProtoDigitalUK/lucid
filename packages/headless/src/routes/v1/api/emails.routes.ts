import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import emails from "../../../controllers/email/index.js";

const roleRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		permissions: {
			global: ["read_email"],
		},
		swaggerSchema: emails.getSingle.swaggerSchema,
		zodSchema: emails.getSingle.zodSchema,
		controller: emails.getSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
		},
		permissions: {
			global: ["read_email"],
		},
		swaggerSchema: emails.getMultiple.swaggerSchema,
		zodSchema: emails.getMultiple.zodSchema,
		controller: emails.getMultiple.controller,
	});
};

export default roleRoutes;
