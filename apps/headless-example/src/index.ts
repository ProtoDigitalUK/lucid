import Fastify from "fastify";
import { log } from "console-log-colors";
import headless from "@protodigital/headless";

const fastify = Fastify({
	logger: true,
});

fastify.register(headless);

const port = Number(process.env.PORT) || 8393;

await fastify.listen({
	port: port,
	host: "0.0.0.0",
});

log.white("----------------------------------------------------");
log.yellow(`CMS started at: http://localhost:${port}`);
log.yellow(`API started at: http://localhost:${port}/api`);
log.white("----------------------------------------------------");
