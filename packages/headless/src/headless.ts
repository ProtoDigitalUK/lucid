import("dotenv/config.js");
import path from "path";
import T from "./translations/index.js";
import { log, red } from "console-log-colors";
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fs from "fs-extra";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import routes from "./routes/index.js";
import getDirName from "./utils/app/get-dirname.js";
import getConfig from "./services/config.js";
import { decodeError } from "./utils/app/error-handler.js";
import seedHeadless from "./services/seed-headless.js";
import registerCronJobs from "./services/cron-jobs.js";
import migrate from "./db/migrate.js";
import { initialiseDB, headlessDB } from "./db/db.js";

const currentDir = getDirName(import.meta.url);

const headless = async (
	fastify: FastifyInstance,
	options: Record<string, string>,
) => {
	try {
		const config = await getConfig();
		await initialiseDB();

		fastify.decorate("db", headlessDB());
		fastify.decorate("config", config);

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
				consumes: ["application/json"],
				produces: ["application/json"],
			},
		});
		await fastify.register(fastifySwaggerUi, {
			routePrefix: "/documentation",
		});

		// ------------------------------------
		// Server wide middleware
		log.white("----------------------------------------------------");
		fastify.register(cors, {
			origin: "http://localhost:3000", // update
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
			allowedHeaders: [
				"Content-Type",
				"Authorization",
				"_csrf",
				"_access",
				"_refresh",
				"headless-environment",
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
		log.white("----------------------------------------------------");
		await migrate(fastify.db);

		// ------------------------------------
		// Initialise
		log.white("----------------------------------------------------");
		await seedHeadless(fastify);
		registerCronJobs(fastify);
		log.yellow("Initialised");

		// ------------------------------------
		// Routes
		log.white("----------------------------------------------------");
		fastify.register(routes);
		fastify.register(fastifyStatic, {
			root: [path.resolve("public"), path.join(currentDir, "../cms")],
			wildcard: false,
		});
		fastify.setNotFoundHandler((request, reply) => {
			const indexPath = path.resolve(currentDir, "../cms/index.html");
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
