import("dotenv/config.js");
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "path";
import { log } from "console-log-colors";

import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fs from "fs-extra";
import fastifyMultipart from "@fastify/multipart";

import db from "./db/db.js";
import routes from "./routes/index.js";
import getDirName from "./utils/app/get-dirname.js";
import getConfig from "./services/config.js";

const currentDir = getDirName(import.meta.url);

const headless = async (
	fastify: FastifyInstance,
	options: Record<string, string>,
) => {
	// await getConfig();

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
			"headless-environment",
			"headless-content-lang",
			"Content-Length",
		],
		credentials: true,
	});
	// fastify.register(fastifyCookie, {
	//   secret: Config.secret,
	// });
	// fastify.register(fastifyMultipart, {
	//   limits: {
	//     fileSize: config.media.maxFileSize,
	//   },
	// });
	log.yellow("Middleware configured");

	// ------------------------------------
	// Migrate DB
	log.white("----------------------------------------------------");
	await migrate(db, {
		migrationsFolder: path.resolve(currentDir, "../drizzle"),
	});

	// ------------------------------------
	// Initialise app
	log.white("----------------------------------------------------");
	// await service(Initialise, true)();
	log.yellow("Start up tasks complete");

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
		reply.status(500).send(error.message);
	});
};

export default fp(headless, {
	name: "headless",
	fastify: "4.x",
});
