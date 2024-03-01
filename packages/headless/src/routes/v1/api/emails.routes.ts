import type { FastifyInstance } from "fastify";
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

	r(fastify, {
		method: "delete",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		permissions: {
			global: ["delete_email"],
		},
		swaggerSchema: emails.deleteSingle.swaggerSchema,
		zodSchema: emails.deleteSingle.zodSchema,
		controller: emails.deleteSingle.controller,
	});

	r(fastify, {
		method: "post",
		url: "/:id/resend",
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		permissions: {
			global: ["send_email"],
		},
		swaggerSchema: emails.resendSingle.swaggerSchema,
		zodSchema: emails.resendSingle.zodSchema,
		controller: emails.resendSingle.controller,
	});
};

export default roleRoutes;
