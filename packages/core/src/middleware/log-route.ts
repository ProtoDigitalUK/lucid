import type { FastifyRequest, FastifyReply } from "fastify";
import headlessLogger from "../libs/logging/index.js";

const logRoute =
	(hook: "prehandler" | "onResponse") =>
	async (request: FastifyRequest, reply: FastifyReply) => {
		if (hook === "prehandler") {
			headlessLogger("info", {
				message: `Request - ${request.url}`,
				scope: request.method,
				data: {
					userAgent: request.headers["user-agent"],
					timeStamp: Date.now(),
				},
			});
			return;
		}

		headlessLogger("info", {
			message: `Response - ${request.url}`,
			scope: request.method,
			data: {
				userAgent: request.headers["user-agent"],
				timeStamp: Date.now(),
				elapsedTime: reply.elapsedTime,
				status: reply.statusCode,
			},
		});
	};
export default logRoute;
