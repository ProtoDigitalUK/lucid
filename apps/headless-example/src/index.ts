import Fastify from "fastify";
import { log } from "console-log-colors";
import headless, { sendEmail } from "@protodigital/headless";

const fastify = Fastify({
	logger: true,
});

fastify.register(headless);

const port = Number(process.env.PORT) || 8393;

fastify.post("/send-email", async (request, reply) => {
	const res = await sendEmail({
		to: "hello@williamyallop.com",
		subject: "Hello",
		template: "contact-form",
		data: {
			name: "William",
			email: "hello@williamyallop.com",
			message: "Hello!",
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
