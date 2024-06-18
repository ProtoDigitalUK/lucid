import lucid, { toolkit, LucidAPIError } from "@lucidcms/core";

lucid.fastify.post("/send-email", async (_, reply) => {
	const res = await toolkit.email.sendEmail({
		to: "hello@williamyallop.com",
		type: "external",
		subject: "Hello",
		template: "password-reset",
		data: {
			firstName: "William",
		},
	});
	if (res.error) throw new LucidAPIError(res.error);
	reply.send(res.data);
});

lucid.start();
