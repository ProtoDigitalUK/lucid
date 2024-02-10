import { FastifyInstance } from "fastify";
import r from "../../../utils/app/route.js";
import account from "../../../controllers/account/index.js";

const roleRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "patch",
		url: "",
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		swaggerSchema: account.updateMe.swaggerSchema,
		zodSchema: account.updateMe.zodSchema,
		controller: account.updateMe.controller,
	});
};

export default roleRoutes;
