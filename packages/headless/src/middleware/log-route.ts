import type { FastifyRequest } from "fastify";
import headlessLogger from "../libs/logging/index.js";

const logRoute = async (request: FastifyRequest) => {
	headlessLogger("info", {
		message: request.url,
		scope: request.method,
		data: {
			userAgent: request.headers["user-agent"],
			timestamp: new Date().toISOString(),
		},
	});
};

export default logRoute;
