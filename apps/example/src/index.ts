import Fastify from "fastify";
import { log } from "console-log-colors";
import headless, { sendEmail } from "@protoheadless/headless";

const fastify = Fastify({
	logger: true,
});

fastify.register(headless);

const port = Number(process.env.PORT) || 8393;

fastify.post("/send-email", async (request, reply) => {
	const res = await sendEmail({
		to: "hello@williamyallop.com",
		subject: "Hello",
		template: "password-reset",
		data: {
			first_name: "William",
		},
	});

	reply.send(res);
});

await fastify.listen({
	port: port,
	host: "0.0.0.0",
});

log.white("----------------------------------------------------");
log.yellow(`CMS started at: http://localhost:${port}`);
log.yellow(`API started at: http://localhost:${port}/api`);
log.white("----------------------------------------------------");
