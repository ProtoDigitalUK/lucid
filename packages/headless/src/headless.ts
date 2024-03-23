import("dotenv/config.js");
import path from "node:path";
import T from "./translations/index.js";
import { log, red } from "console-log-colors";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fs from "fs-extra";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import routes from "./routes/index.js";
import { getDirName } from "./utils/helpers.js";
import getConfig from "./libs/config/get-config.js";
import type { Config } from "./libs/config/config-schema.js";
import { decodeError } from "./utils/error-handler.js";
import seedHeadless from "./services/seed-headless.js";
import registerCronJobs from "./services/cron-jobs.js";
import migrate from "./db/migrate.js";
import { initialiseDB, headlessDB } from "./db/db.js";
import serviceWrapper from "./utils/service-wrapper.js";

const currentDir = getDirName(import.meta.url);

const headless = async (fastify: FastifyInstance) => {
	try {
		const config = await getConfig();
		await initialiseDB();

		fastify.decorate("db", headlessDB());
		fastify.decorate<Config>("config", config);

		// ------------------------------------
		// Swagger
		await fastify.register(fastifySwagger, {
			swagger: {
				info: {
					title: "Headless API",
					description: "Headless API",
					version: "0.0.1",
				},
				host: config.host
					.replace("http://", "")
					.replace("https://", ""),
				schemes: ["http"],
				consumes: ["application/json", "multipart/form-data"],
				produces: ["application/json"],
			},
		});
		await fastify.register(fastifySwaggerUi, {
			routePrefix: "/documentation",
		});

		// ------------------------------------
		// Server wide middleware
		log.white("-".repeat(60));
		fastify.register(cors, {
			origin: "http://localhost:3000", // update
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
			allowedHeaders: [
				"Content-Type",
				"Authorization",
				"_csrf",
				"_access",
				"_refresh",
				"headless-content-lang",
				"Content-Length",
			],
			credentials: true,
		});
		fastify.register(fastifyCookie, {
			secret: config.keys.cookieSecret,
		});
		fastify.register(fastifyMultipart, {
			limits: {
				fileSize: 10 * 1024 * 1024, // 10MB TODO: move to config
			},
		});
		log.yellow("Middleware configured");

		// ------------------------------------
		// Migrate DB
		log.white("-".repeat(60));
		await migrate(fastify.db);
		log.yellow("Migrated");

		// ------------------------------------
		// Initialise
		log.white("-".repeat(60));
		await serviceWrapper(
			seedHeadless,
			true,
		)({
			db: fastify.db,
		});
		registerCronJobs(fastify);
		log.yellow("Initialised");

		// ------------------------------------
		// Routes
		log.white("-".repeat(60));
		fastify.register(routes);
		fastify.register(fastifyStatic, {
			root: [path.resolve("public"), path.join(currentDir, "../cms")],
			wildcard: false,
		});
		fastify.setNotFoundHandler((request, reply) => {
			const indexPath = path.resolve(currentDir, "../cms/index.html");

			if (request.url.startsWith("/api")) {
				reply.code(404).send("Page not found");
				return;
			}

			if (fs.existsSync(indexPath)) {
				const stream = fs.createReadStream(indexPath);
				reply.type("text/html").send(stream);
			} else {
				reply.code(404).send("Page not found");
			}
		});
		log.yellow("Routes initialised");

		// ------------------------------------
		// Error handling
		fastify.setErrorHandler((error, request, reply) => {
			const { name, message, status, errors, code } = decodeError(error);

			request.log.error(red(`${status} - ${message}`));

			if (reply.sent) {
				request.log.error(T("headers_already_sent"));
				return;
			}

			const response = Object.fromEntries(
				Object.entries({
					code,
					status,
					name,
					message,
					errors,
				}).filter(([_, value]) => value !== null),
			);

			reply.status(status).send(response);
		});
	} catch (error) {
		const err = error as Error;
		fastify.log.error(err.message);
	}
};

export default fp(headless, {
	name: "headless",
	fastify: "4.x",
});
