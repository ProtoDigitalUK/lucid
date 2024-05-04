import lucid, { sendEmail } from "@lucidcms/core";

lucid.fastify.post("/send-email", async (request, reply) => {
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

lucid.start();
