import { FastifyInstance } from "fastify";
// API
import auth from "./auth.routes.js";

const routes = async (fastify: FastifyInstance) => {
	fastify.register(auth, {
		prefix: "/auth",
	});
};

export default routes;
