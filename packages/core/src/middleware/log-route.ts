import type { FastifyRequest, FastifyReply } from "fastify";
import lucidLogger from "../libs/logging/index.js";

const logRoute =
	(hook: "prehandler" | "onResponse") =>
	async (request: FastifyRequest, reply: FastifyReply) => {
		if (hook === "prehandler") {
			lucidLogger("info", {
				message: `Request - ${request.url}`,
				scope: request.method,
				data: {
					userAgent: request.headers["user-agent"],
					timeStamp: Date.now(),
				},
			});
			return;
		}

		lucidLogger("info", {
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
