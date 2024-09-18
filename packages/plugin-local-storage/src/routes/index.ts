import crypto from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { PluginOptions } from "../types/types.js";

const routes =
	(pluginOptions: PluginOptions) => async (fastify: FastifyInstance) => {
		//* TODO: update to use lucid middleware for auth, permissions, validation etc.
		fastify.get(
			"/api/v1/localstorage/upload/:key",
			async (request, reply) => {
				const { key } = request.params as { key: string };
				const { token, timestamp } = request.query as {
					token: string;
					timestamp: string;
				};

				const expectedToken = crypto
					.createHmac("sha256", pluginOptions.secretKey)
					.update(`${key}${timestamp}`)
					.digest("hex");

				if (
					token !== expectedToken ||
					Date.now() - Number.parseInt(timestamp) > 3600000
				) {
					//* 1 hour expiration - move to constants
					reply.code(403).send({ error: "Invalid or expired token" });
					return;
				}

				// upload media
				reply.send({ message: "Upload successful" });
			},
		);
	};

export default routes;
