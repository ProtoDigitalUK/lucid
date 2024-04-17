import headless, { sendEmail } from "@protoheadless/headless";

headless.fastify.post("/send-email", async (request, reply) => {
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

headless.start();
